import { getValueByPath, parseVariables, containsVariables, extractVariables } from './variableParser';

// 测试数据
const mockVariables = {
  api1: {
    data: {
      user: {
        name: '张三',
        age: 30,
        email: 'zhangsan@example.com'
      },
      products: [
        {
          id: 1,
          name: '产品A',
          price: 199
        },
        {
          id: 2,
          name: '产品B',
          price: 299
        }
      ],
      total: 2,
      status: 'success'
    }
  },
  api2: {
    data: {
      site: {
        name: '测试平台',
        version: '1.0.0'
      }
    }
  }
};

// 测试getValueByPath函数
describe('getValueByPath', () => {
  test('应该正确获取嵌套属性', () => {
    expect(getValueByPath(mockVariables, 'api1.data.user.name')).toBe('张三');
    expect(getValueByPath(mockVariables, 'api1.data.user.age')).toBe(30);
  });
  
  test('应该返回undefined当路径不存在', () => {
    expect(getValueByPath(mockVariables, 'api1.data.nonexistent')).toBeUndefined();
    expect(getValueByPath(mockVariables, '')).toBeUndefined();
    expect(getValueByPath(undefined, 'api1.data')).toBeUndefined();
  });
  
  test('应该正确获取数组元素', () => {
    expect(getValueByPath(mockVariables, 'api1.data.products[0].name')).toBe('产品A');
  });
});

// 测试parseVariables函数
describe('parseVariables', () => {
  test('应该正确解析单个变量', () => {
    const text = '你好 ${api1.data.user.name}';
    expect(parseVariables(text, mockVariables)).toBe('你好 张三');
  });
  
  test('应该正确解析多个变量', () => {
    const text = '用户${api1.data.user.name}，年龄${api1.data.user.age}';
    expect(parseVariables(text, mockVariables)).toBe('用户张三，年龄30');
  });
  
  test('应该保持未找到的变量不变', () => {
    const text = '${api1.data.user.name} 和 ${api3.data.name}';
    expect(parseVariables(text, mockVariables)).toBe('张三 和 ${api3.data.name}');
  });
  
  test('应该正确处理非字符串值', () => {
    expect(parseVariables(undefined, mockVariables)).toBeUndefined();
    expect(parseVariables(null, mockVariables)).toBeNull();
    expect(parseVariables(123, mockVariables)).toBe(123);
  });
  
  test('应该返回完整的API对象当只有键名', () => {
    const text = '${api1}';
    const expected = JSON.stringify(mockVariables.api1);
    expect(parseVariables(text, mockVariables)).toBe(expected);
  });
});

// 测试containsVariables函数
describe('containsVariables', () => {
  test('应该检测到包含变量的文本', () => {
    expect(containsVariables('${api1.data.user.name}')).toBe(true);
    expect(containsVariables('文本 ${api1} 文本')).toBe(true);
  });
  
  test('应该检测不包含变量的文本', () => {
    expect(containsVariables('普通文本')).toBe(false);
    expect(containsVariables('')).toBe(false);
    expect(containsVariables(undefined)).toBe(false);
  });
});

// 测试extractVariables函数
describe('extractVariables', () => {
  test('应该提取单个变量', () => {
    expect(extractVariables('${api1.data.user.name}')).toEqual(['api1.data.user.name']);
  });
  
  test('应该提取多个变量', () => {
    const text = '${api1.data.user.name} 和 ${api2.data.site.name}';
    expect(extractVariables(text)).toEqual(['api1.data.user.name', 'api2.data.site.name']);
  });
  
  test('应该返回空数组当没有变量', () => {
    expect(extractVariables('普通文本')).toEqual([]);
    expect(extractVariables('')).toEqual([]);
    expect(extractVariables(undefined)).toEqual([]);
  });
});

// 集成测试
describe('变量解析集成测试', () => {
  test('完整的解析流程', () => {
    const template = '欢迎访问${api2.data.site.name}，用户${api1.data.user.name}！';
    const result = parseVariables(template, mockVariables);
    expect(result).toBe('欢迎访问测试平台，用户张三！');
    expect(containsVariables(result)).toBe(false); // 解析后不应再包含变量
  });
  
  test('处理复杂的嵌套结构', () => {
    const template = '产品列表：${api1.data.products[0].name}，${api1.data.products[1].name}，共${api1.data.total}个产品';
    const result = parseVariables(template, mockVariables);
    expect(result).toBe('产品列表：产品A，产品B，共2个产品');
  });
});