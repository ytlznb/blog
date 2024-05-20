# -
这是个新生课程要求完成的简易博客系统
#新生项目课程：云计算环境下的博客系统开发


 ## 实验名称：云计算环境下的博客系统开发实践  
 ## 实验目的：学习并掌握HTML、CSS和JavaScript的基础知识，能够自己开发一个具有基本功能的博客系统， 
 ## 实验环境：操作系统：Linux
  

                     编程工具：文本编辑器/Visual Studio

                     浏览器：Edge浏览器

## 实验内容

1. 使用HTML构建博客系统的基本结构；
  
2. 使用CSS对博客系统进行样式设计；
  
3. 使用JavaScript实现博客系统的交互功能。

##### 数据库结构
```mermaid
graph LR
  blog[blog]-->ar[writer]-..->id
  ar-..->title
  ar-..->description
  ar-..->markdown
  ar-..->createdtime
  blog-->user[users]-..->username
  user-..->password
  ```


 ### 实验步骤： 
 
    1.首先完成后端代码  
       
```const express = require('express');//导入 Express.js 模块并将其赋值给变量 express
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
```

    2.然后完成前端代码
*******完成登陆页面的ejs，css和JavaScript文件的编写*******  
***ejs***  
```<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>login</title>
		<link rel="stylesheet" type="text/css" href="DL.css" />
		<script src="DL.js"></script>
		<script src="click.js"></script>
	</head>
	<body>
		<div class="control">
			<div class="item">
				<div class="active">登录</div><div>注册</div>
			</div>
			<div class="content">
				<div style="display: block;">
					<p>账号</p>
					<input type="text" placeholder="username" id="login-username"/>
					<p>密码</p>
					<input type="password" placeholder="password" id="login-password"/>
					<br/>
					<input type="submit" value="登录" onclick="login()"/>
				</div>
				<div>
					<p>用户名</p>
					<input type="text" placeholder="username" id="register-username"/>
					<p>密码</p>
					<input type="password" placeholder="password" id="register-password"/>
					<p>邮箱</p>
					<input type="text" placeholder="email" id="register-email"/>
					<br/>
					<input type="submit" value="注册" onclick="register()"/>
				</div>
			</div>
		</div>
	</body>
</html>
```
***css***   

```*{
	margin: 0;
	padding: 0;
}
body{
	background: #f3f3f3;
}
.control{
	width: 340px;
	background: white;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	border-radius: 5px;
}
.item{
	width: 340px;
	height: 60px;
	background: #eeeeee;
}
.item div{
	width: 170px;
	height: 60px;
	display: inline-block;
	color: black;
	font-size: 18px;
	text-align: center;
	line-height: 60px;
	cursor: pointer;
}
.content{
	width: 100%;
}
.content div{
	margin: 20px 30px;
	display: none;
	text-align: left;
}
p{
	color: #4a4a4a;
	margin-top: 30px;
	margin-bottom: 6px;
	font-size: 15px;
}
.content input[type="text"], .content input[type="password"]{
	width: 100%;
	height: 40px;
	border-radius: 3px;
	border: 1px solid #adadad;
	padding: 0 10px;
	box-sizing: border-box;
}
.content input[type="submit"]{
	margin-top: 40px;
	width: 100%;
	height: 40px;
	border-radius: 5px;
	color: white;
	border: 1px solid #adadad;
	background: #00dd60;
	cursor: pointer;
	letter-spacing: 4px;
	margin-bottom: 40px;
}
.active{
	background: white;
}
.item div:hover{
	background: #f6f6f6;
}
```
    

***JavaScript***    

```window.onload = function(){
	var item = document.getElementsByClassName("item");
	var it = item[0].getElementsByTagName("div");
	var content = document.getElementsByClassName("content");
	var con = content[0].getElementsByTagName("div");
	//通过DOM操作获取了名为"item"的元素集合以及名为"content"的元素集合。其中，"item"表示选项卡的标签，而"content"表示选项卡对应的内容区域
	for(let i=0;i<it.length;i++){   
		it[i].onclick = function(){
			for(let j=0;j<it.length;j++){
				it[j].className = '';
				con[j].style.display = "none";
			}
			it[i].className = "active";
			con[i].style.display = "block";
		}            ////遍历"item"元素集合，为每个选项卡标签添加点击事件的监听器。当某个选项卡被点击时，会执行遍历所有选项卡标签，将它们的类名设为空字符串，以取消选中效果，并将对应的内容区域隐藏起来，接着，将当前点击的选项卡标签的类名设置为"active"，以突出显示选中状态，并将对应的内容区域显示出来
	}
}             //它处理了一个交互功能，通过点击切换不同的选项卡内容
```
```function login() {
   const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "/all";
        } else {
            alert("登录失败")
        }
        document.getElementById("login-username").value="";
	    document.getElementById("login-password").value="";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}                     //函数处理登录操作，包括从页面中获取用户名和密码，通过POST请求将其发送给服务器进行验证。如果验证成功，跳转到"/all"页面；如果验证失败，弹出"登录失败"的提示框，并清空输入框。

function register() {
    
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password}),
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.success) {
            
           alert("注册成功");

        } else {
            
            alert("注册失败");

        }
        document.getElementById("register-username").value="";
	    document.getElementById("register-password").value="";
	    document.getElementById("register-email").value="";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}                    //函数处理注册操作，类似地从页面中获取用户名和密码，通过POST请求将其发送给服务器进行注册。如果注册成功，弹出"注册成功"的提示框；如果注册失败，弹出"注册失败"的提示框，并清空输入框。
```  
//这些函数使用了Fetch API来进行网络请求，发送POST请求到服务器的/login和/register路径，并将用户名和密码作为JSON数据进行传递。在响应中，通过调用.json()方法将响应数据解析为JSON对象，并根据JSON对象中的success属性进行相应的处理。
 
******完成博客主页的ejs和css文件的编写******   
***ejs***    
```<!DOCTYPE html>
<html lang="en">
<head>
<link rel="stylesheet" type="text/css" href="all.css" />
  <title>Blog</title>
</head>
<body>
    <h1 class="mb-4">Blog</h1>
        <a href="/new" class="mom">New Article</a>
        <hr />
    <div class="content">
     <% writens.forEach(writen => { %>
        <h1>Title</h1>
        <p><%= writen.title %></p>
        <h1>Description</h1>
        <p><%= writen.description %></p>
        <h1>Markdown</h1>
        <p><%= writen.markdown %></p>
        <h3 class="hh1">Time</h3>
        <p class="hh2"><%= writen.time %></p>
        <a href="/edit/<%= writen._id %>">编辑</a>
        <form action="/<%= writen._id %>?_method=DELETE" method="POST">
            <button type="submit" >删除</button>
        </form>
        <hr />
     <% }) %>
    </div>
</body>
</html>
```
***css***  
```
*{
	margin: 0;
	padding: 0;
}
h1{
    width: 100%;
    text-align: left;
    margin-top: 30px;
	margin-bottom: 6px;
    margin-left: 30px;
    border-radius: 5px;
}
body{
    background-image: url('BJ.png');
    background-attachment: fixed; 
}
.content{
	width: 100%;
    text-align: left;
    margin-top: 30px;
    padding: 20px; 
    margin-bottom: 50px; 
    font-size:20px;
}
p{
    margin-left: 0px;
}
.content h1:hover,
.content p:hover {
    color: red; 
    cursor: pointer;
}
.mom{
    margin-left:30px
}
.mb-4{
   font-size:80px;
   color:purple;
}
.hh1{
    color:blue;
}
.hh2{
    color:blue;
}
 ```
******完成新增博客页面的ejs和css文件的编写******   
***ejs***   
```<!DOCTYPE html>
<head>
<link rel="stylesheet" type="text/css" href="new.css" />
</head>
<body>

<h1>New Article</h1>

<form action="/new" method="POST">
    <div>
    <label for="title">Title</label>
    <input required type="text" name="title" id="title" class="cal">
    </div>

    <div>
    <label for="description" class="dde">Description</label>
    <textarea name="description" id="description" class="description"></textarea>
    </div>

    <div class="mark1">
    <label for="markdown">Markdown</label>
    <textarea required name="markdown" id="markdown" class="mark2"></textarea>
    </div>

    <a href="/all" class="cancel">返回</a>
    <button type="submit">保存</button>
</form>

</body>
</html>
```
***css***  
```
*{
	margin: 0;
	padding: 0;
}
body{
	background:url(BJ.png) no-repeat 0px 0px;
}
label[for="title"]{
    margin-left: 116px;
}
h1{
    width: 100%;
    text-align: left;
    margin-top: 30px;
	margin-bottom: 6px;
    margin-left: 30px;
}
.cancel{
    margin-left: 90px;
}
.description {  
        width: 700px;  
        height: 500px;
        padding: 10px;
        border: 1px solid ;  
        border-radius: 10px;
        font-size: 20px; 
        margin-top: 20px;
        margin-left: 150px;
    } 
.dde{
    position: absolute;
    top:140px;
    left:57px;
}
.cal{
    width: 200px;  
    height: 40px;
}
.mark1{
    position: absolute;
    top:65px;
    left:400px;
}
.mark2{
    width: 700px;
    border: 1px solid ;  
    border-radius: 10px;
    font-size: 20px;
    padding: 10px;
    }
  ```  
******完成博客展示页面的ejs和css文件的编写******   
***ejs***
```<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="display.css" />
  <title>Blog</title>
</head>
<body>
  <h1>Title</h1>
  <p><%= writen.title %></p>
  <h1>Description</h1>
  <p><%= writen.description %></p>
  <h1>Markdown</h1>
  <p><%= writen.markdown %></p>
  <h2>Time</h2>
  <p><%= writen.time %></p>
  <a href="/all">HOME</a>
</body>
</html>

***css***   
*{
	margin: 0;
	padding: 0;
}
body{
	background:url(BJ.png) no-repeat 0px 0px;
    margin-left: 10px;
    margin-top: 10px;
}
```
******完成博客编辑页面的ejs和css文件的编写******   
***ejs***
```<!DOCTYPE html>
<body>

<h1>Edit Article</h1>

<form action="/<%= writen._id %>?_method=PUT" method="POST">
    <div>
    <label for="title">Title</label>
    <input required value="<%= writen.title %>" type="text" name="title" id="title" class="cal">
    </div>

    <div>
    <label for="description" class="dde">Description</label>
    <textarea name="description" id="description" class="description"><%= writen.description %></textarea>
    </div>

    <div>
    <label for="markdown">Markdown</label>
    <textarea name="markdown" id="markdown" class="markdown1"><%= writen.markdown %></textarea>
    </div>

    <a href="/all" class="coo1">返回</a>
    <button type="submit" class="coo2">保存</button>
</form>
</body>
</html>
```
***css***  
```*{
	margin: 0;
	padding: 0;
}
body{
    background-color:orange;
}
label[for="title"]{
    margin-left: 116px;
}
h1{
    width: 100%;
    text-align: left;
    margin-top: 30px;
	margin-bottom: 6px;
    margin-left: 30px;
}
.cancel{
    margin-left: 90px;
}
.description {  
        width: 700px;  
        height: 500px;
        padding: 10px;
        border: 1px solid ;  
        border-radius: 10px;
        font-size: 20px; 
        margin-top: 20px;
        margin-left: 150px;
    } 
.dde{
    position: absolute;
    top:140px;
    left:50px;
}
.cal{
    width: 200px;  
    height: 40px;
}
.coo1{
    margin-left: 150px;
}
label[for="markdown"]{
    margin-left: 64px;
}
.markdown1{
    width: 800px;  
    height: 200px;
     padding: 10px;
    border: 1px solid ;  
    border-radius: 10px;
    font-size: 20px;
}
```
## 实验结果：成功开发了一个具备基本功能的博客系统。   
## 结果分析和讨论：该博客系统可以实现用户的注册和登录功能，博客文章的创建、编辑和删除功能等。通过对实验结果的分析和讨论，我们发现系统的性能良好，能够处理大量用户的请求，并具备一定的可扩展性。在未来的优化和扩展中，可以考虑添加更多的功能模块，如图片上传、用户权限控制等，以满足更多用户的需求。

## 参考文献

1. 教程：[w3school 在线教程](https://www.w3school.com.cn/)
  
2. CSS样式参考：https://navnav.co
  

| 工作量统计表 | 基础功能 | 新增功能1 | 新增功能2 | 新增功能3 | 新增功能4 | 新增功能5 | 新增功能6 |
| --- | --- | --- | ---  | --- | --- | --- | ---  |  
| 描述  | 对博客系统中博文的增删改查操作 | 原博客系统CSS美化 | 增加时间记录 | 增加markdown输入框 | 登录注册页面选项卡的制作 | 登录功能和注册功能的实现 | 优化目录结构 |
| 学时  | 8   | 6    | 3      | 3   |  6    | 8    | 3      |
