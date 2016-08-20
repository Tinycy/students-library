
function myEditStudentMsg(aId){
		
		
		location.href = '/api/student/msg?id=' +  aId
		
		
		
//		return
		/*
		 * 下边的代码使用的是ajax，ajax是不会刷新页面，所以渲染 动态页面失败
		 */
//	$.get(
//			'/api/student/msg',
//			{id:aId},function(response){
//				if(response.result == 0){
//				alert(response.msg)
//				}
//				else{
//					alert(response.msg)
//					console.dir(response)
//					
//				}
//			
//			}
//	)

}


function myDeleteStudentMsg(){
				
			$.get(
			'/api/student/delete',
			{id:aId},
			function(response){
				if(response.result == 0){
				alert(response.msg)
				}
				else{
					alert(response.msg)
					console.log(response)
					
					//刷新当前页面
					location.reload()

}
}
			)}