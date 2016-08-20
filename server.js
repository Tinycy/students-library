
const express = require("express"),

	  bodyPaser = require("body-parser"),
	  
	  template = require("art-template"),
	  
	  mongoose = require("mongoose"),
	  
	  app = express()
		
		app.use(express.static('static'))
		
		app.use(bodyPaser.urlencoded({extended:true}))
		
		template.config('cache',true)
		
		app.engine('.html',template.__express)
		
		app.set('view engine','html')

		//设置连接的数据库url
		mongoose.connect("mongodb://localhost/html5")
		
		//调用connection获取数据库对象
		var db = mongoose.connection
		
		//构造函数，定义一个数据模型，
		var Student = mongoose.model('student',{
				name:String,
				age:Number,
				isMale:Boolean,
				phone:String,
				email:String,
				description:String,
				ip:String,
				createTime:Date,
				updateTime:Date
		
		})
		
		//监听数据库出错的事件
		db.on('error',(err)=>{
			console.error('服务器启动失败了',err)
		})
		
		//数据库在操作之前要先打开，监听数据库是否打开 
		db.on('open',(err)=>{
			if(err){
				 console.log('数据库打开失败',err)
			}
			else{
				console.log('数据库打开成功！')
			}
		})
		
		/*
		 * 访问服务器返回动态页面
		 */
		app.get('/',(request,response)=>{
				
//				Student.findByIdAndUpdate()   更新
//				Student.findByIdAndRemove()   删除
				//find()查询数据库中的所有数据，数据之间用空格隔开
				//select()只获取指定的数据
				Student.find().select('name isMale age phone email').exec(function(err,data){
								
								if(err){
									console.error('获取失败了',err)
								}
								else{
									
//									获取到的data是一个存放所有数据的数组
								console.dir("获取成功："+data.length)
								
								//取出数组中的数据对象转化为实际对象。
								
//								var obj = data[0].toObject()
								
								//map()遍历数组，参与指定的函数运算。函数内的参数遍历到的数组中的元素。(可以在函数结束位置return参与运算后的元素,把参与运算后的元素放入新的数组，并返回该新数组)
							var newData =	data.map(function(item){
										
										var obj = item.toObject()
										
//										添加id属性
										obj.id = obj._id.toString()
										
										//删除_id属性
										delete obj._id
										

										return obj
								})
							
//							console.dir(newData)
							
							//渲染模板，
							response.render('index',{students:newData})
							
//							{{each students as aStudent}}
							
							
							
							
								}
								
								
					})
				
				
				
//				console.log('点击了添加')
		})
		app.post('/api/student/add',(request,response)=>{
			//获取请求体的对象	
				var body = request.body
					//给body对象添加属性，
						body.ip = request.ip
						body.createTime = new Date()
						body.updateTime = body.createTime
						//往mongodb数据保存用户数据
						//要想保存用户数据需要创建数据模型对象，把数据存入数据模型对象
						//使用数据模型对象的save（）方法来保存数据
						//参数1：保存的数据对象
						//参数2：save的回调函数，返回的错误信息
						var student = new Student(body)
					//	console.dir(body),打印body的详细信息
//					  console.dir(student)
					 student.save(student,(err)=>{
					 	if(err){
					 		console.log('保存数据出错了')
					 		response.json({result:0,msg:'数据保存失败，系统出错了'})
					 	}
					 	else{
					 		console.log('保存数据成功了')
					 		response.json({result:1,msg:'数据保存成功'})
					 	}
					 
					 })
		
		})
		
		
		/*
		 * API：获取某一个学生信息
		 */
		app.get('/api/student/msg',(request,response)=>{
						
						//get请求的参数是在queryString里边使用query参数调用
					var id = request.query.id
					
					//根据id来查询集合中的某一条数据
					Student.findById(id,function(err,data){
					
									if(err){
										response.json({result:0,msg:'系统错误！'})
									}
									else{
									console.dir(data)
//											response.json({result:1,msg:'获取成功！'})
											var obj = data.toObject()
											
											obj.id = obj._id.toString()
											
											delete obj._id
											
											console.dir('>>>>>' + obj)
											response.render('update',obj)
											
									}
						
					})
					
		})
		
		/*
		 * API更新某一个学生信息。
		 */
		
		app.post('/api/student/update/:id',(request,response)=>{
						var id = request.params.id
						
						//console.log(">>>>>>>>>>" + id)
						
						//findByIdAndUpdate（）查找某一个信息，并更新该信息
						//参数1：数据的id
						//参数2：更新的数据
						//参数3：更新后的回调函数
						Student.findByIdAndUpdate(id,request.body,(err)=>{
									if(err){
											response.json({result:0,msg:'系统异常，更新失败'})
											
									}
									else{
										response.json({result:1,msg:'更新成功'})
									}
						
						})
		})
		
		/*
		 * 删除某一个学生信息
		 */
		app.get('/api/student/delete',(request,response)=>{
			var id = request.query.id
		
			Student.findByIdAndRemove(id,(err)=>{
			if(err){
											response.json({result:0,msg:'系统异常，删除失败'})
											
									}
									else{
										response.json({result:1,msg:'删除成功'})
									}
			
			})
		
		})
		
		
		
	
		app.listen(3000,function(){
			console.log('Tiny server is runing!')
		})
