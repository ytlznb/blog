const express = require('express');//导入 Express.js 模块并将其赋值给变量 express
const app = express();//创建 Express.js 应用程序的实例，并将其赋值给变量 app

app.use(express.json());//将 express.json() 中间件添加到应用程序中。它解析带有 JSON 数据的传入请求，并将其暴露在 req.body 属性中

app.use(express.urlencoded({ extended: false }))//将 express.urlencoded() 中间件添加到应用程序中。它解析带有 URL 编码数据的传入请求，并将其暴露在 req.body 属性中

const methodOverride = require('method-override')//导入 method-override 模块，用于覆盖 HTTP 请求方法。这允许客户端通过在 POST 请求中发送特殊的 _method 参数来使用其他 HTTP 方法
app.use(methodOverride('_method'))//将 methodOverride('_method') 中间件添加到应用程序中。它查找请求中的 _method 参数，并相应地覆盖 HTTP 方法。


// model 创建
const mongoose = require('mongoose');//导入了Mongoose模块
mongoose.connect('mongodb://my-mongo/mydate');//连接到命名为maydate的MongoDB数据库
const ytlSchema = new mongoose.Schema({
    title: String,
    description: String,
    markdown: String,
    time:String
});//创建了一个名为"ytlSchema"的Mongoose模式,用于定义将存储在"writen"集合中的文档的结构。模式定义了"title"、"description"、"markdown"和"time"字段。
const writen = mongoose.model('writen', ytlSchema);//基于"ytlSchema"模式创建了一个名为"writen"的Mongoose模型,用于对该集合中的数据进行查询和操作

const myusers = new mongoose.Schema({
    username: String,
    password: String
});//创建了一个名为"myusers"的Mongoose模式,用于定义将存储在"JM"集合中的文档的结构。模式定义了"username"和"password"字段
const JM = mongoose.model('JM', myusers);//基于"myusers"模式创建了一个名为"JM"的Mongoose模型,用于对该集合中的数据进行查询和操作
//创建model完成


app.use(express.static('public'));//将public文件夹设置为Express应用程序的静态文件目录。这意味着该文件夹中的内容可以通过公开的URL直接访问,而无需通过路由进行处理

app.set('view engine', 'ejs');//设置了Express应用程序的视图模板引擎为EJS。它告诉Express使用EJS作为默认的视图引擎,以便在渲染动态内容时使用EJS模板文件


//注册页面
app.post('/register', (req, res) => {  //用于处理POST请求的路由处理程序,匹配/register路径
    const { username, password} = req.body; //从请求的正文中解构出username和password字段
    const newJM = new JM({ username, password});//创建一个新的JM实例,使用解构的username和password字段作为构造函数的参数。
    newJM.save()//保存新创建的JM实例到MongoDB数据库中
    .then(savedUser => {   //Promise链式调用,当newJM.save()成功后，将会执行相应的回调逻辑。
        console.log('User registered:', savedUser);//打印注册成功的用户信息到控制台
        res.json({ success: true, message: '注册成功' });//向客户端发送JSON响应,表示注册成功
    })
    .catch(error => {   //Promise链式调用的错误处理部分,当newJM.save()失败时，执行相应的错误回调逻辑
        console.error(error);  //将错误信息打印到控制台
        res.status(500).json({ success: false, message: '注册失败' }); //向客户端发送JSON响应,表示注册失败.
    });

});

//登陆页面
app.get('/', (req,res) => {
  res.render('DL')//用于处理GET请求的路由处理程序,匹配根路径(/),并使用视图模板引擎将名为DL的模板渲染成HTML,并将其发送给客户端
})

//博客主页
app.get('/all', async (req, res) => {
  const all = await writen.find();
  res.render('all', { writens: all })//用于处理GET请求的路由处理程序,匹配/all路径,使用Mongoose模型writen执行find()操作,从MongoDB数据库中获取所有的"writen"数据,再使用视图模板引擎将名为all的模板渲染成HTML,并将数据传递给模板
})

//新增文章
app.get('/new', (req, res) => {
  res.render('new');//用于处理GET请求的路由处理程序,匹配根路径(/new),并使用视图模板引擎将名为new的模板渲染成HTML,并将其发送给客户端
})

//修改文章
app.get('/edit/:id', async (req, res) => {
    const one = await writen.findOne({ _id: req.params.id });
    res.render('edit', { writen: one })
})  //处理了/edit/:id路径的GET请求。它用于获取特定id的"writen"数据,并将其渲染到名为edit的视图模板中

//保存文章
app.post('/new', async (req,res) => {
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    one = new writen({ title: req.body.title, description: req.body.description, markdown: req.body.markdown, time:currentTime});
    await one.save();
    res.render('display', { writen: one })
})//用于处理/new路径的POST请求,创建新的"writen"数据,并将其保存到数据库中,并将其渲染到名为display的视图模板中。


//删除文章
app.delete('/:id', async (req, res) => {
  await writen.deleteMany({ _id: req.params.id });
  res.redirect('/all')
})  //用于处理/:id路径的DELETE请求,删除特定id的"writen"数据，并重定向到/all路径。

//展示修改文章
app.put('/:id', async (req, res) => {
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    let data = {}
    data.title = req.body.title
    data.description = req.body.description
    data.markdown = req.body.markdown
    data.time = currentTime
    var one = await writen.findOne({ _id: req.params.id });
    if (one != null) {
        one.title = data.title;
        one.description = data.description;
        one.markdown = data.markdown;
        one.time = data.time
        await one.save();       
    }  
    res.render('display', { writen: data })
})  //用于处理/:id路径的PUT请求,更新特定id的"writen"数据,并将更新后的数据渲染到名为display的视图模板中。

//登录验证
app.post('/login', async (req, res) => {   //用于处理POST请求的路由处理程序,监听/login路径
    const username1 = req.body.username;
    const password1 = req.body.password;  //从请求的req.body中获取用户名和密码,并将它们分别赋值

    try {
        const user = await JM.findOne({ username: username1 }).select('password').exec(); //使用Mongoose模型JM执行findOne()操作,从MongoDB数据库中根据传递的用户名查找对应的用户密码

        if (!user) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' }); //如果未找到用户数据,则返回一个带有401状态码的JSON响应,表示用户名或密码错误
        }

        const password = user.password; //将从数据库中获取的用户数据中的密码赋值

        if (password1 === password) {
            return res.json({ success: true, message: '登录成功' }); //如果请求中的密码与数据库中的密码匹配,则返回一个带有200状态码的JSON响应,表示登录成功
        } else {
            return res.status(401).json({ success: false, message: '用户名或密码错误' }); //如果密码不匹配,则返回一个带有401状态码的JSON响应,表示用户名或密码错误
        }
    } catch (err) {  //这是一个异常处理块，捕获可能发生的异步操作错误
        console.error(err);
        return res.status(500).json({ success: false, message: '服务器错误' }); //如果发生错误,返回一个带有500状态码的JSON响应,表示服务器错误
    }
});




app.listen(12338,()=>{
  console.log('express server running at http://121.48.165.22:12338/')
}) //监听12338端口