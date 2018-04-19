;(function(){
	var planebox=document.getElementById('planebox');//获取game盒子
	var oStrong=document.getElementsByTagName('strong')[0];
	var zscore=0;
	
	//1.背景运动起来
	var bgposition=0;
	var bgtimer=setInterval(function(){
		planebox.style.backgroundPosition='0 '+bgposition+'px';
		bgposition+=2;
	},20);
	
	
	//2.创建我方飞机的构造函数
	function Myplane(w,h,x,y,imgurl,boomurl){
		this.w=w;//宽
		this.h=h;//高
		this.x=x;//水平位置
		this.y=y;//垂直位置
		this.imgurl=imgurl;//我方飞机图片
		this.boomurl=boomurl;//我方飞机爆炸图片
		this.createmyplane();
	}
	//创建我方飞机
	Myplane.prototype.createmyplane=function(){
		this.myplaneimg=document.createElement('img');
		this.myplaneimg.src=this.imgurl;
		this.myplaneimg.style.cssText=`width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
		planebox.appendChild(this.myplaneimg);
		this.myplanemove();//我方飞机运动
		this.myplaneshoot();//我方飞机发射子弹
	}
	//我方飞机移动 W:87  S:83  A:65 D:68   k:75
	Myplane.prototype.myplanemove=function(){
		var that=this;
		//要给document绑定多个事件：事件绑定addEventListener(事件,函数,false)
		var uptimer=null,downtimer=null,lefttimer=null,righttimer=null;
		var uplock=true,downlock=true,leftlock=true,rightlock=true;
		var maxtop=planebox.offsetHeight-that.h;
		var maxleft=planebox.offsetWidth-that.w;
		document.addEventListener('keydown',directionmove,false);
		function directionmove(ev){
			var ev=ev||window.event;
			switch(ev.keyCode){
				case 87: moveup(); break;
				case 83: movedown(); break;
				case 65: moveleft(); break;
				case 68: moveright(); break;
			}
			function moveup(){
				if(uplock){
					clearInterval(downtimer);//当按下w键的时候，s键的定时器停掉。
					uptimer=setInterval(function(){
						uplock=false;
						that.y-=4;
						if(that.y<0){
							that.y=0;
						}
						that.myplaneimg.style.top=that.y+'px';
					},30);
				}
			}
			function movedown(){
				if(downlock){
					clearInterval(uptimer);
					downtimer=setInterval(function(){
						downlock=false;
						that.y+=4;
						if(that.y>=maxtop){
							that.y=maxtop;
						}
						that.myplaneimg.style.top=that.y+'px';
					},30);
				}
			}
			function moveleft(){
				if(leftlock){
					clearInterval(righttimer);
					lefttimer=setInterval(function(){
						leftlock=false;
						that.x-=4;
						if(that.x<0){
							that.x=0;
						}
						that.myplaneimg.style.left=that.x+'px';
					},30);
				}
			}
			function moveright(){
				if(rightlock){
					clearInterval(lefttimer);
					righttimer=setInterval(function(){
						rightlock=false;
						that.x+=4;
						if(that.x>=maxleft){
							that.x=maxleft;
						}
						that.myplaneimg.style.left=that.x+'px';
					},30);
				}
			}
		}
		
		document.addEventListener('keyup',function(ev){
			var ev=ev||window.event;
			if(ev.keyCode==87){
				clearInterval(uptimer);
				uplock=true;
			}
			if(ev.keyCode==83){
				clearInterval(downtimer);
				downlock=true;
			}
			if(ev.keyCode==65){
				clearInterval(lefttimer);
				leftlock=true;
			}
			if(ev.keyCode==68){
				clearInterval(righttimer);
				rightlock=true;
			}
		},false);
	}
	
	//我方飞机发射子弹
	Myplane.prototype.myplaneshoot=function(){
		var that=this;
		var shoottimer=null;
		var shootlock=true;
		document.addEventListener('keydown',shootbullet,false);
		function shootbullet(ev){
			var ev=ev||window.event;
			if(ev.keyCode==75){
				if(shootlock){
					shootlock=false;
					function shoot(){
							new Bullet(6,14,that.myplaneimg.offsetLeft+that.myplaneimg.offsetWidth/2-3,that.myplaneimg.offsetTop-14,'img/bullet.png');
					}
					shoot();
					shoottimer=setInterval(shoot,200);
				}
			}
		}
		
		document.addEventListener('keyup',function(ev){
			var ev=ev||window.event;
			if(ev.keyCode==75){
				clearInterval(shoottimer);
				shootlock=true;
			}
		},false);
	}
	
	
	//3.创建子弹的构造函数
	function Bullet(w,h,x,y,imgurl){
		this.w=w;//宽
		this.h=h;//高
		this.x=x;//水平位置
		this.y=y;//垂直位置
		this.imgurl=imgurl;//我方飞机图片
		this.createbullet();
	}
	//创建子弹
	Bullet.prototype.createbullet=function(){
		this.bulletimg=document.createElement('img');
		this.bulletimg.src=this.imgurl;
		this.bulletimg.style.cssText=`width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
		planebox.appendChild(this.bulletimg);
		this.bulletmove();//子弹运动
		
	}
	//子弹运动
	Bullet.prototype.bulletmove=function(){
		var that=this;
		this.timer=setInterval(function(){//this.timer:每一个子弹添加一个定时器
			that.y-=4;//如果子弹运动到planebox的外面，删除它
			if(that.y==-that.h){
				clearInterval(that.timer);
				planebox.removeChild(that.bulletimg);
			}
			
			that.bulletimg.style.top=that.y+'px';
			that.bullethit();//子弹碰撞
		},30);
	}
	
	
	//子弹和敌机进行碰撞
	Bullet.prototype.bullethit=function(){
		var enemys=document.querySelectorAll('.enemy');//获取所有的敌机
		for(var i=0;i<enemys.length;i++){
			if( this.x+this.w>=enemys[i].offsetLeft && this.x<=enemys[i].offsetLeft+enemys[i].offsetWidth && this.y+this.h>=enemys[i].offsetTop &&this.y<=enemys[i].offsetTop+enemys[i].offsetHeight){
				
				clearInterval(this.timer);//子弹停止运动
				try{
					planebox.removeChild(this.bulletimg)//子弹消失
				}catch(e){
					return;
				}
				enemys[i].blood--;//碰撞上血量-1
				enemys[i].checkblood();//执行一下检查血量的方法。
				
				
			}
		}
	}
	
	//4.创建敌机的构造函数
	function Enemyplane(w,h,x,y,imgurl,boomurl,blood,speed,score){
		this.w=w;//宽
		this.h=h;//高
		this.x=x;//水平位置
		this.y=y;//垂直位置
		this.imgurl=imgurl;//敌机图片
		this.boomurl=boomurl;//敌机飞机爆炸图片
		this.blood=blood;//血量
		this.speed=speed;//速度
		this.score=score;//分数
		this.createenemy();
	}
	
	//创建敌机
	Enemyplane.prototype.createenemy=function(){
		var that=this;
		this.enemyimg=document.createElement('img');
		this.enemyimg.src=this.imgurl;
		this.enemyimg.style.cssText=`width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
		planebox.appendChild(this.enemyimg);
		this.enemyimg.className='enemy';
		this.enemyimg.blood=this.blood;//将血量赋值给敌机做属性。
		this.enemyimg.score=this.score;
		this.enemyimg.checkblood=function(){//给每架敌机添加一个检查血量的方法。
			//this:敌机
			if(this.blood<=0){//没血了
				this.className='';//清除类名
				this.src=that.boomurl;
				clearInterval(this.timer);//清除敌机运动的定时器
				setTimeout(function(){
					planebox.removeChild(that.enemyimg);
				},400);
				zscore+=this.score;//累加分数
				oStrong.innerHTML=zscore;//赋值
			}
			
		}
		
		this.enemymove();
	}
	
	//敌机运动(多个敌机)
	Enemyplane.prototype.enemymove=function(){
		var that=this;
		this.enemyimg.timer=setInterval(function(){
			that.y+=that.speed;
			if(that.y>=planebox.offsetHeight){
				clearInterval(that.enemyimg.timer);
				planebox.removeChild(that.enemyimg);
			}
			that.enemyimg.style.top=that.y+'px';
			that.enemyhit();//敌机碰撞我方飞机
		},30);
	}
	
	//敌机和我方飞机碰撞
	Enemyplane.prototype.enemyhit=function(){
		if(this.x+this.w>=ourplane.x && this.x<=ourplane.x+ourplane.w && this.y+this.h>=ourplane.y && this.y<=ourplane.y+ourplane.h){
			var enemys=document.querySelectorAll('.enemy');//获取所有的敌机
			for(var i=0;i<enemys.length;i++){
				clearInterval(enemys[i].timer);
			}
			clearInterval(enemytimer);
			clearInterval(bgtimer);
			ourplane.myplaneimg.src=ourplane.boomurl;
			setTimeout(function(){
				alert('game over');
				location.reload();//刷新
			},500)
			
			
		}
	}
	
	
	//随机生成不同的飞机，飞机的数量
	var enemytimer=setInterval(function(){
		for(var i=0;i<ranNum(5,13);i++){//随机产生多少数量的飞机
			var num=ranNum(1,20);
			if(num>=1 && num<15){//1-14 小飞机
				new Enemyplane(34,24,ranNum(0,planebox.offsetWidth-34),-24,'img/smallplane.png','img/smallplaneboom.gif',1,ranNum(2,4),1);
			}else if(num>=15 && num<20){//15-19 中飞机
				new Enemyplane(46,60,ranNum(0,planebox.offsetWidth-46),-60,'img/midplane.png','img/midplaneboom.gif',3,ranNum(1,3),3);
			}else if(num==20){//打飞机
				new Enemyplane(110,164,ranNum(0,planebox.offsetWidth-110),-164,'img/bigplane.png','img/bigplaneboom.gif',10,1,10);
			}
		}
	},1000);
	
	
	//飞机实例化
	var ourplane=new Myplane(66,80,(planebox.offsetWidth-66)/2,planebox.offsetHeight-80,'img/myplane.gif','img/myplaneBoom.gif');
	
	//随机数的函数
	function ranNum(min,max){
		return Math.round(Math.random()*(max-min))+min;
	}
	
})();



