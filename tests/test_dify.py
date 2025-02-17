import requests
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 从环境变量获取 Dify API 配置
WORKFLOW_1_KEY = os.getenv('WORKFLOW_1_KEY')
WORKFLOW_2_KEY = os.getenv('WORKFLOW_2_KEY')
BASE_URL = os.getenv('DIFY_BASE_URL')

# 验证环境变量是否存在
if not WORKFLOW_1_KEY or not WORKFLOW_2_KEY or not BASE_URL:
    raise ValueError("请确保设置了 WORKFLOW_1_KEY、WORKFLOW_2_KEY 和 DIFY_BASE_URL 环境变量")

def test_dify_chat(workflow_key=WORKFLOW_1_KEY):
    """测试 Dify 的聊天接口"""
    
    headers = {
        "Authorization": f"Bearer {workflow_key}",
        "Content-Type": "application/json"
    }
    
    # 测试数据
    data = {
        "inputs": {},
        "query": "你好，请帮我写一个教学设计",
        "response_mode": "blocking",  # 使用 blocking 而不是 streaming 以便于测试
        "conversation_id": "",
        "user": "test_user"
    }
    
    print(f"使用的 API 配置：")
    print(f"BASE_URL: {BASE_URL}")
    print(f"WORKFLOW_KEY: {workflow_key[:8]}..." if workflow_key else "WORKFLOW_KEY: 未设置")
    print("\n开始发送请求...\n")
    
    # 发送请求
    response = requests.post(
        f"{BASE_URL}/chat-messages",
        headers=headers,
        json=data
    )
    
    # 打印响应
    if response.status_code == 200:
        result = response.json()
        print("API 响应成功！")
        print("回答内容：")
        print(result.get('answer', '没有找到回答'))
        
        # 打印完整响应以便调试
        print("\n完整响应：")
        print(result)
    else:
        print(f"请求失败，状态码：{response.status_code}")
        print(f"错误信息：{response.text}")

if __name__ == "__main__":
    print("开始测试 Dify API...")
    print("\n测试工作流 1 (教学设计)...")
    test_dify_chat(WORKFLOW_1_KEY)
    
    print("\n测试工作流 2 (通用工作流)...")
    test_dify_chat(WORKFLOW_2_KEY) 