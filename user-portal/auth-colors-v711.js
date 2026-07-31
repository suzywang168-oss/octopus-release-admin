(()=>{
const style=document.createElement('style');
style.textContent=`
/* V7.11 auth color refinement */
.auth-card{
  background:#0d1b2d!important;
  border-color:#223a58!important;
  box-shadow:0 28px 80px rgba(0,0,0,.30)!important;
}
.auth-card h2{color:#f2f6fb!important}
.auth-card>p{color:#8296ad!important}
.auth-tabs{
  background:#091523!important;
  border:1px solid #1d314a!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.018)!important;
}
.auth-tabs button{
  color:#7f92a8!important;
  background:transparent!important;
  box-shadow:none!important;
}
.auth-tabs button:hover{
  color:#d7e1ec!important;
  background:#102238!important;
}
.auth-tabs button.active{
  color:#f5f8fc!important;
  background:#172a42!important;
  border:1px solid #2b4869!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.045)!important;
}
.auth-method{border-bottom-color:#27405d!important}
.auth-method button{color:#778ca4!important}
.auth-method button:hover{color:#ccd7e4!important}
.auth-method button.active{color:#eef3f9!important}
.auth-method button.active:after{background:#7893df!important}
.field label{color:#8ea0b4!important}
.field input,.field select,.field textarea{
  background:#091726!important;
  border-color:#29435f!important;
  color:#eef4fb!important;
}
.field input::placeholder,.field textarea::placeholder{color:#61758c!important}
.field input:focus,.field select:focus,.field textarea:focus{
  border-color:#6682cb!important;
  box-shadow:0 0 0 3px rgba(102,130,203,.12)!important;
}
.submit{
  background:#4968bd!important;
  color:#fff!important;
  box-shadow:none!important;
}
.submit:hover{background:#5575cb!important}
.submit:active{background:#3f5ca8!important;transform:translateY(1px)}
.secondary{
  background:#102136!important;
  border-color:#2b4664!important;
  color:#aebdd0!important;
}
.secondary:hover{background:#152a43!important;color:#e1e8f1!important}
.code-btn{
  background:#13263d!important;
  border-color:#325174!important;
  color:#b7c6d8!important;
}
.code-btn:hover{background:#19314d!important;color:#eef4fb!important}
.eye{
  background:#14273d!important;
  color:#94a7bc!important;
}
.eye:hover{background:#1a3049!important;color:#e4ebf3!important}
.auth-row{color:#8194aa!important}
.auth-row a{color:#9caed9!important}
.auth-row input[type=checkbox],.legal input[type=checkbox]{accent-color:#5575cb!important}
.auth-error{
  background:rgba(198,76,96,.09)!important;
  border-color:rgba(220,100,119,.30)!important;
  color:#f2a6b2!important;
}
.auth-lang{
  background:#0d1c2e!important;
  border-color:#2a4563!important;
  color:#aab9ca!important;
}
.reg-progress .reg-step{
  background:#0a1727!important;
  border-color:#213a56!important;
  color:#71869e!important;
}
.reg-progress .reg-step.active{
  background:#142844!important;
  border-color:#4968bd!important;
  color:#eef4fb!important;
  box-shadow:none!important;
}
.reg-progress .reg-step.done{
  background:#102a2a!important;
  border-color:#2c6b62!important;
  color:#a9d9cf!important;
}
.reg-progress .reg-step b{background:#172b43!important;color:#879bb2!important}
.reg-progress .reg-step.active b{background:#4968bd!important;color:#fff!important}
.reg-progress .reg-step.done b{background:#2f756a!important;color:#fff!important}
@media(max-width:700px){
  .auth-card{border-color:#1e3652!important}
}
`;
document.head.appendChild(style);
window.OctopusAuthColorsV711=true;
})();