
$('#darkmode-toggle').change(function(){
  let bgcolor = $(this).is(':checked') ? '#242424' : '#fff';
  $('body').css('background-color', bgcolor);
  let fontcolor = $(this).is(':checked') ? '#fff' : '#000';
  $('body').css('color', fontcolor);
  let github_logo = $(this).is(':checked') ? './assets/github_white.png' : './assets/github.png';
  $('.github_logo').attr('src', github_logo);
  let web_logo = $(this).is(':checked') ? './assets/web_dark.png' : './assets/web_light.png';
  $('#web_logo').attr('src', web_logo);
  let mail_logo = $(this).is(':checked') ? './assets/mail_dark.png' : './assets/mail_light.png';
  $('#mail_logo').attr('src', mail_logo);
  
  if($(this).is(':checked')){
    chrome.storage.local.set({'darkmodeFlag': 1});
  }
  else{
      chrome.storage.local.set({'darkmodeFlag': 0});
  }
  });