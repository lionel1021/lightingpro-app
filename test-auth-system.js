const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uxzycbjjzkdceqzhypdi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4enljYmpqemtkY2Vxemh5cGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTIwNTksImV4cCI6MjA2NzMyODA1OX0.sKGf45x2bdl3_tNo73_3tW9Qqv2SC4s414QZScSZcpY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthSystem() {
  console.log('🔐 开始测试LightingPro认证系统...\n');
  
  try {
    // 1. 测试Supabase连接
    console.log('1️⃣ 测试Supabase连接...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('❌ 会话获取失败:', sessionError.message);
    } else {
      console.log('✅ Supabase连接正常');
      console.log('当前会话状态:', session ? '已登录' : '未登录');
    }
    
    // 2. 测试用户注册功能
    console.log('\n2️⃣ 测试用户注册功能...');
    const testEmail = `test+${Date.now()}@lightingpro.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`尝试注册用户: ${testEmail}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });
    
    if (signUpError) {
      console.log('❌ 注册失败:', signUpError.message);
    } else {
      console.log('✅ 注册成功');
      console.log('用户ID:', signUpData.user?.id);
      console.log('需要邮箱确认:', !signUpData.session);
    }
    
    // 3. 测试用户登录功能 (如果不需要邮箱确认)
    if (signUpData.session) {
      console.log('\n3️⃣ 测试用户登录功能...');
      
      // 先登出
      await supabase.auth.signOut();
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (signInError) {
        console.log('❌ 登录失败:', signInError.message);
      } else {
        console.log('✅ 登录成功');
        console.log('用户邮箱:', signInData.user?.email);
        console.log('访问令牌存在:', !!signInData.session?.access_token);
      }
      
      // 4. 测试会话管理
      console.log('\n4️⃣ 测试会话管理...');
      const { data: currentSession } = await supabase.auth.getSession();
      console.log('当前会话有效:', !!currentSession.session);
      
      // 5. 测试用户登出
      console.log('\n5️⃣ 测试用户登出...');
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.log('❌ 登出失败:', signOutError.message);
      } else {
        console.log('✅ 登出成功');
      }
      
      const { data: afterSignOut } = await supabase.auth.getSession();
      console.log('登出后会话状态:', afterSignOut.session ? '仍有会话' : '已清除会话');
    } else {
      console.log('\n⚠️  由于需要邮箱确认，跳过登录测试');
    }
    
    // 6. 测试数据库用户表
    console.log('\n6️⃣ 测试数据库用户表...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ 用户表查询失败:', profilesError.message);
      console.log('   这表明数据库表结构可能未创建');
    } else {
      console.log('✅ 用户表查询成功');
      console.log('表中数据数量:', profiles?.length || 0);
    }
    
    // 7. 测试API端点
    console.log('\n7️⃣ 测试认证相关API端点...');
    try {
      const healthResponse = await fetch('http://localhost:3002/api/health');
      const healthData = await healthResponse.json();
      console.log('API健康状态:', healthData.status);
      console.log('数据库状态:', healthData.services?.database?.status || 'unknown');
    } catch (apiError) {
      console.log('❌ API端点测试失败:', apiError.message);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
  
  console.log('\n🏁 认证系统测试完成');
}

testAuthSystem();