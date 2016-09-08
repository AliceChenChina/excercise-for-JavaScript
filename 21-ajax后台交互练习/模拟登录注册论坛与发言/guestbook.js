window.onload = function() {
	
	var oUser = document.getElementById('user');
	var oReg = document.getElementById('reg');
	var oLogin = document.getElementById('login');
	var oUserInfo = document.getElementById('userinfo');
	var oList = document.getElementById('list');
	var iPage = 1;
	
	var oShowMore = document.getElementById('showMore');
	
	var oUsername1 = document.getElementById('username1');
	var oVerifyUserNameMsg = document.getElementById('verifyUserNameMsg');
	
	//初始化
	updateUserStatus();
	
	function updateUserStatus() {
		var uid = getCookie('uid');
		var username = getCookie('username');
		if (uid) {
			//如果是登陆状态
			oUser.style.display = 'block';
			oUserInfo.innerHTML = username;
			oReg.style.display = 'none';
			oLogin.style.display = 'none';
		} else {
			oUser.style.display = 'none';
			oUserInfo.innerHTML = '';
			oReg.style.display = 'block';
			oLogin.style.display = 'block';
		}
	}
	
	showList();
	
	/*
	验证用户名
	
	*/
	oUsername1.onblur = function() {
		ajax('get', 'guestbook/index.php', 'm=index&a=verifyUserName&username=' + this.value, function(data) {
			//alert(data);
			var d = JSON.parse(data);
			
			oVerifyUserNameMsg.innerHTML = d.message;
			
			if (d.code) {
				oVerifyUserNameMsg.style.color = 'red';
			} else {
				oVerifyUserNameMsg.style.color = 'green';
			}
		});
	}
	
	/*
	用户注册
	
	*/
	var oPassword1 = document.getElementById('password1');
	var oRegBtn = document.getElementById('btnReg');
	oRegBtn.onclick = function() {
		
		ajax('post', 'guestbook/index.php', 'm=index&a=reg&username='+encodeURI(oUsername1.value)+'&password=' + oPassword1.value, function(data) {
			var d = JSON.parse(data);
			alert(d.message);
			
		});
		
	}
	
	/*
	用户登陆
	
	*/
	var oUsername2 = document.getElementById('username2');
	var oPassword2 = document.getElementById('password2');
	var oLoginBtn = document.getElementById('btnLogin');
	oLoginBtn.onclick = function() {
		
		ajax('post', 'guestbook/index.php', 'm=index&a=login&username='+encodeURI(oUsername2.value)+'&password=' + oPassword2.value, function(data) {
			var d = JSON.parse(data);
			alert(d.message);
			
			if (!d.code) {
				updateUserStatus();
			}
			
		});
		
	}
	
	/*
	用户退出
	
	*/
	var oLogout = document.getElementById('logout');
	oLogout.onclick = function() {
		
		ajax('get', 'guestbook/index.php', 'm=index&a=logout', function(data) {
			
			var d = JSON.parse(data);
			alert(d.message);
			
			if (!d.code) {
				//退出成功
				updateUserStatus();
			}
			
		});
		
		return false;
		
	}
	
	/*
	留言
	
	*/
	var oContent = document.getElementById('content');
	var oPostBtn = document.getElementById('btnPost');
	oPostBtn.onclick = function() {
		
		ajax('post', 'guestbook/index.php', 'm=index&a=send&content='+encodeURI(oContent.value), function(data) {
			
			var d = JSON.parse(data);
			alert(d.message);
			
			if (!d.code) {
				//添加当前留言到列表中
				createList(d.data, true);
			}
			
		});
		
	}
	
	function createList(data, insert) {
		var oDl = document.createElement('dl');
				
		var oDt = document.createElement('dt');
		var oStrong = document.createElement('strong');
		oStrong.innerHTML = data.username;
		oDt.appendChild(oStrong);
		
		var oDd1 = document.createElement('dd');
		oDd1.innerHTML = data.content;
		
		var oDd2 = document.createElement('dd');
		oDd2.className = 't';
		var oA1 = document.createElement('a');
		oA1.href = '';
		oA1.innerHTML = '顶(<span>'+data.support+'</span>)';
		var oA2 = document.createElement('a');
		oA2.href = '';
		oA2.innerHTML = '踩(<span>'+data.oppose+'</span>)';
		oDd2.appendChild(oA1);
		oDd2.appendChild(oA2);
		
		oDl.appendChild(oDt);
		oDl.appendChild(oDd1);
		oDl.appendChild(oDd2);
		
		if (insert && oList.children[0]) {
			oList.insertBefore(oDl, oList.children[0]);
		} else {
			oList.appendChild(oDl);
		}
	}
	
	//点击显示更多的内容
	oShowMore.onclick = function() {
		iPage++;
		showList();
	}
	
	function showList() {
		/*
		初始化留言列表
		
		*/
		ajax('get', 'guestbook/index.php', 'm=index&a=getList&n=2&page=' + iPage, function(data) {
			
			var d = JSON.parse(data);
			
			var data = d.data;
			
			if (data) {
				for (var i=0; i<data.list.length; i++) {
					createList(data.list[i]);
				}
			} else {
				if (iPage == 1) {
					oList.innerHTML = '现在还没有留言，快来抢沙发...';
				}
				oShowMore.style.display = 'none';
			}
			
		});
	}
}

function getCookie(key) {
	var arr1 = document.cookie.split('; ');
	for (var i=0; i<arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if (arr2[0]==key) {
			return arr2[1];
		}
	}
}