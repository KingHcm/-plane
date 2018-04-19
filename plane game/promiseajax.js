

function ajax(obj){//obj:对象
	var promise=new Promise(function(resolve,reject){
		
		function objtostring(obj){
			var arr=[];
			for(var i in obj){
				arr.push(i+'='+obj[i])
			}
			
			return arr.join('&');
		}
		obj.type=obj.type||'get';//如果存在obj.type，用obj.type的值，否则用get
		obj.data=obj.data||'';//如果数据不存在，空的。
		//判断是否异步
		if(obj.async==false){//满足条件同步,传了false。
			obj.async=false
		}else{
			obj.async=true
		}
		
		//判断地址是否存在
		if(obj.url=='' || !obj.url){//判断url是否为空或者是否存在
			throw new Error('接口地址不存在或者为空');
		}
		var ajax=new XMLHttpRequest();
		
		//数据的判断
		if(typeof obj.data=='object' && typeof obj.data.length!='number'){//对象
			obj.data=objtostring(obj.data);//将对象转换成字符串再给obj.data
		}else if(typeof obj.data=='string'){
			obj.data=obj.data;
		}else{
			throw new Error('数据格式必须为字符串或者对象');
		}
		
		//如果用采用get方式，同时数据存在
		if(obj.type=='get' && obj.data){
			obj.url+='?'+obj.data;
		}
		
		ajax.open(obj.type,obj.url,obj.async);
		
		if(obj.type=='post'){//post传输数据需要请求头文件。
			ajax.setRequestHeader('content-type','application/x-www-form-urlencoded');
			ajax.send(obj.data);
		}else if(obj.type=='get'){
			ajax.send();
		}
		
		if(obj.async==false){//如果是同步，send必须执行完才执行下面的代码，否则再根据状态码进行监听和判断。
			obj.success&&obj.success(ajax.responseText);
		}else{
			ajax.onreadystatechange=function(){
				if(ajax.readyState==4){
					if(ajax.status==200){
						//obj.success&&obj.success(ajax.responseText);
						resolve(ajax.responseText);
					}else{
						//obj.error&&obj.error('接口地址有误'+'  '+ajax.status);
						reject('接口地址有误'+'  '+ajax.status);
					}
				}
			}
		}
		
		
		
	});
	
	return promise;
	
}
