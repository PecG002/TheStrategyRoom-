
document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.menu'), mobile=document.querySelector('.mobilelinks');
 if(menu) menu.addEventListener('click',()=>mobile.classList.toggle('open'));
 document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();document.getElementById('bookModal').classList.add('open')}));
 const close=document.querySelector('.close'); if(close) close.addEventListener('click',()=>document.getElementById('bookModal').classList.remove('open'));
 const modal=document.getElementById('bookModal'); if(modal) modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
});
