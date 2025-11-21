import yaml from 'js-yaml';

/**
 * API解析器接口，定义不同平台API文档解析器需要实现的方法
 */
export interface ApiParser {
  /**
   * 解析API文档内容
   * @param content 文档内容
   * @returns 解析后的API数据对象
   */
  parse(content: string): any;
  
  /**
   * 验证文档是否符合该解析器的格式
   * @param content 文档内容
   * @returns 是否有效
   */
  validate(content: string): boolean;
}

/**
 * Apifox Markdown解析器，用于解析包含YAML格式OpenAPI规范的Markdown文档
 */
export class ApifoxMarkdownParser implements ApiParser {
  /**
   * 从Markdown中提取并解析YAML格式的OpenAPI规范
   * @param markdownContent Markdown文档内容
   * @returns 解析后的OpenAPI数据对象
   */
  parse(markdownContent: string): any {
    // 从markdown中提取YAML部分（在```yaml和```之间的内容）
    const yamlMatch = markdownContent.match(/```yaml\s*([\s\S]*?)\s*```/);
    if (!yamlMatch || !yamlMatch[1]) {
      throw new Error('无法从markdown中提取YAML内容');
    }
    
    // 解析YAML为JavaScript对象
    const yamlContent = yamlMatch[1];
    const openApiSpec = yaml.load(yamlContent) as any;
    
    // 尝试从OpenAPI规范中提取MemberVO的properties
    if (openApiSpec && openApiSpec.components && openApiSpec.components.schemas && openApiSpec.components.schemas.MemberVO) {
      // 返回包含data字段的结构，让用户可以通过api1.data.birthDate引用
      return {
        data: openApiSpec.components.schemas.MemberVO.properties
      };
    }
    
    // 如果找不到MemberVO的properties，返回完整的解析结果作为后备
    return openApiSpec;
  }
  
  /**
   * 验证文档是否包含有效的YAML格式OpenAPI规范
   * @param markdownContent Markdown文档内容
   * @returns 是否有效
   */
  validate(markdownContent: string): boolean {
    try {
      const yamlMatch = markdownContent.match(/```yaml\s*([\s\S]*?)\s*```/);
      if (!yamlMatch || !yamlMatch[1]) {
        return false;
      }
      
      // 尝试解析YAML内容
      yaml.load(yamlMatch[1]);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * API解析器工厂，用于创建不同类型的API解析器
 */
export class ApiParserFactory {
  /**
   * 根据内容类型创建适合的API解析器
   * @param content 文档内容
   * @param type 可选的解析器类型
   * @returns 适合的API解析器实例
   */
  static createParser(content: string, type?: string): ApiParser {
    // 如果指定了类型，根据类型创建解析器
    if (type === 'apifox') {
      return new ApifoxMarkdownParser();
    }
    
    // 否则，根据内容自动检测并创建适合的解析器
    const apifoxParser = new ApifoxMarkdownParser();
    if (apifoxParser.validate(content)) {
      return apifoxParser;
    }
    
    // 默认使用Apifox Markdown解析器
    return new ApifoxMarkdownParser();
  }
}

/**
 * 通用API解析函数，根据内容自动选择合适的解析器
 * @param content 文档内容
 * @param type 可选的解析器类型
 * @returns 解析后的API数据对象
 */
export async function parseApiContent(content: string, type?: string): Promise<any> {
  try {
    const parser = ApiParserFactory.createParser(content, type);
    return parser.parse(content);
  } catch (error) {
    console.error('API解析错误:', error);
    throw error;
  }
}

/**
 * 从Markdown文件中解析API文档
 * @param markdownContent Markdown文档内容
 * @returns 解析后的API数据对象
 */
export async function parseMarkdownApi(markdownContent: string): Promise<any> {
  const parser = new ApifoxMarkdownParser();
  return parser.parse(markdownContent);
}