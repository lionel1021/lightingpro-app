export default function DeployTest() {
  const timestamp = new Date().toISOString();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">🚀 部署测试页面</h1>
        <p className="text-xl">如果您看到这个页面，说明Netlify部署正在工作</p>
        <div className="bg-black/20 rounded-lg p-4">
          <p>构建时间: {timestamp}</p>
          <p>提交ID: 4b7dd44</p>
        </div>
        <div className="space-y-2">
          <p>✅ Next.js 构建成功</p>
          <p>✅ TypeScript 编译通过</p>
          <p>✅ 部署流程正常</p>
        </div>
        <a 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
        >
          返回主页查看更新
        </a>
      </div>
    </div>
  );
}