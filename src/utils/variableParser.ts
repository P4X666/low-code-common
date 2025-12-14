// 变量解析器工具，用于解析和替换文本中的变量引用

/**
 * 表示解析后的变量节点
 */
export interface VariableNode {
  type: 'text' | 'variable';
  content: string;
  variablePath?: string;
  isApiVariable?: boolean;
  variableValue?: any;
  isOpenApiProperty?: boolean;
  description?: string;
  apiKey?: string;
}

/**
 * 从对象中根据路径获取值
 * @param obj 源对象
 * @param path 点分隔的路径，如 'data.user.name'
 * @returns 找到的值或undefined
 */
export function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  
  const pathParts = path.split('.');
  let current = obj;
  
  for (const part of pathParts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * 解析文本中的变量引用并返回结构化数据
 * @param text 包含变量引用的文本，如 'Hello ${api1.data.user.name}'
 * @param variables 变量数据对象
 * @returns 解析后的结构化数据数组
 */
export function parseVariables(text: string, variables: Record<string, any>): VariableNode[] {
  if (!text || typeof text !== 'string') return [{ type: 'text', content: text }];
  
  // 检查是否包含不完整的变量引用
  const hasIncompleteVar = text.includes('${') && !text.includes('}') || 
                          text.split('${').length - 1 > text.split('}').length - 1;
  
  // 如果有不完整的变量引用，直接返回整个文本作为普通文本
  if (hasIncompleteVar) {
    return [{ type: 'text', content: text }];
  }
  
  const result: VariableNode[] = [];
  const variableRegex = /\$\{([^}]+)\}/g;
  let lastIndex = 0;
  let match;
  
  try {
    // 查找所有变量引用
    while ((match = variableRegex.exec(text)) !== null) {
      // 添加变量前的普通文本
      if (match.index > lastIndex) {
        result.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      
      // 处理变量引用
      const path = match[1].trim();
      const matchResult = path.match(/^(api\d+)(\.(.+))?$/);
      
      if (matchResult) {
        const [, apiKey, , apiPath] = matchResult;
        let variableValue = undefined;
        let isOpenApiProperty = false;
        let description = undefined;
        
        if (variables[apiKey]) {
          if (apiPath) {
            // 完整路径，如 api1.data.user.name
            variableValue = getValueByPath(variables[apiKey], apiPath);
            
            // 检查是否是OpenAPI属性对象
            if (variableValue && typeof variableValue === 'object' && 'description' in variableValue) {
              isOpenApiProperty = true;
              description = variableValue.description;
            }
          }
        }
        
        result.push({
          type: 'variable',
          content: match[0], // 保留原始引用文本如 ${api1.data.birthDate}
          variablePath: path,
          isApiVariable: true,
          variableValue,
          isOpenApiProperty,
          description,
          apiKey
        });
      } else {
        // 非API变量
        result.push({
          type: 'variable',
          content: match[0],
          variablePath: path,
          isApiVariable: false
        });
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // 添加最后一个变量后的文本
    if (lastIndex < text.length) {
      result.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }
    
    // 如果解析后没有任何节点，返回原始文本
    if (result.length === 0) {
      return [{ type: 'text', content: text }];
    }
  } catch (error) {
    console.error('解析变量时出错:', error);
    // 出错时返回原始文本
    return [{ type: 'text', content: text }];
  }

  return result;
}

/**
 * 将VariableNode数组转换为纯文本（用于兼容旧逻辑）
 * @param nodes VariableNode数组
 * @returns 合并后的文本
 */
export function nodesToText(nodes: VariableNode[]): string {
  return nodes.map(node => {
    if (node.type === 'text') {
      return node.content;
    } else if (node.isOpenApiProperty && node.description) {
      return node.description;
    } else if (node.variableValue !== undefined) {
      return String(node.variableValue);
    }
    return node.content;
  }).join('');
}

/**
 * 检查文本中是否包含变量引用
 * @param text 要检查的文本
 * @returns 是否包含变量引用
 */
export function containsVariables(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  const variableRegex = /\$\{([^}]+)\}/;
  return variableRegex.test(text);
}

/**
 * 提取文本中所有的变量引用
 * @param text 要提取的文本
 * @returns 变量引用数组
 */
export function extractVariables(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  
  const variableRegex = /\$\{([^}]+)\}/g;
  const matches = [];
  let match;
  
  while ((match = variableRegex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}