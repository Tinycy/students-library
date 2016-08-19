
$('form').submit(function(e){
		e.preventDefault()
		//alert('xxxxxx')
		
		var data = new FormData(this)
		
		//serialize()是把表单里边的数据序列化为一个对象，对象就是表单里边的数据
		data = $(this).serialize()
		
		
		$.post(
			$('form').attr('action'),
			data,
			function(response){
			if(response.result == 0){
				alert(response.msg)
			}
			else{
				alert(response.msg)
				location.href='/'
				
				
			}
			
			}
		)
})
