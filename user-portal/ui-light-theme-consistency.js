(()=>{
'use strict';
const s=document.createElement('style');
s.id='octopus-light-theme-consistency';
s.textContent=`
html.oct-overview-route #octopusGlobalActionHost,html.oct-overview-route .ota-toolbar>.v815primary,html.oct-overview-route #pageRoot>.v815page:not(.occ-page){display:none!important}
html.octopus-light :is(.ota-toolbar,.v815top,.v815header),body.light :is(.ota-toolbar,.v815top,.v815header){background:#f7f9fb!important;color:#27313b!important;border-color:#d8e0e7!important;box-shadow:none!important}
html.octopus-light #v80nav,body.light #v80nav{background:#f1f4f7!important;color:#27313b!important;border-color:#d8e0e7!important;box-shadow:none!important}
html.octopus-light #v80nav>*,body.light #v80nav>*{background:transparent!important}
html.octopus-light #v80nav :is(div,b,strong,small,span),body.light #v80nav :is(div,b,strong,small,span){color:inherit!important;text-shadow:none!important}
html.octopus-light #v80nav :is(.oct-light-dark-surface,.oct-l-tenant-card,.oct-l-user-card),body.light #v80nav :is(.oct-light-dark-surface,.oct-l-tenant-card,.oct-l-user-card){background:#f7f9fb!important;color:#2d3843!important;border:1px solid #d9e1e8!important;box-shadow:none!important}
html.octopus-light #v80nav :is(.oct-l-brand-mark,.oct-l-tenant-mark,.oct-l-user-mark),body.light #v80nav :is(.oct-l-brand-mark,.oct-l-tenant-mark,.oct-l-user-mark){background:#dfe7f8!important;color:#405ca8!important;border:1px solid #cbd7ef!important;box-shadow:none!important}
html.octopus-light #v80nav :is(.oct-l-brand-title,.oct-l-tenant-name,.oct-l-user-name,.v815gh b),body.light #v80nav :is(.oct-l-brand-title,.oct-l-tenant-name,.oct-l-user-name,.v815gh b){color:#29343f!important;opacity:1!important}
html.octopus-light #v80nav :is(.oct-l-brand-sub,.oct-l-tenant-sub,.oct-l-user-sub,.v815gh small),body.light #v80nav :is(.oct-l-brand-sub,.oct-l-tenant-sub,.oct-l-user-sub,.v815gh small){color:#7b8895!important;opacity:1!important}
html.octopus-light #v80nav button,body.light #v80nav button{background:transparent!important;color:#66727e!important;border-color:transparent!important;box-shadow:none!important;text-shadow:none!important}
html.octopus-light #v80nav button:hover,body.light #v80nav button:hover{background:#e8edf2!important;color:#33404c!important}
html.octopus-light #v80nav button.active,html.octopus-light #v80nav .v815item.active,body.light #v80nav button.active,body.light #v80nav .v815item.active{background:#e2e8f4!important;color:#38528f!important;border-color:#bdcbed!important;box-shadow:inset 3px 0 #6683df!important}
html.octopus-light #v80nav :is(.v815no,.v815item>span),body.light #v80nav :is(.v815no,.v815item>span){color:#8794a1!important}
html.octopus-light #v80nav .v815item.active>span,body.light #v80nav .v815item.active>span{color:#6683df!important}
html.octopus-light :is(.loc-dialog-shell,.rvw-dialog-shell,.loc-panel,.rvw-editor-card),body.light :is(.loc-dialog-shell,.rvw-dialog-shell,.loc-panel,.rvw-editor-card){background:#f7f9fb!important;color:#27313b!important;border-color:#d8e0e7!important}
`;
document.head.appendChild(s);
})();
