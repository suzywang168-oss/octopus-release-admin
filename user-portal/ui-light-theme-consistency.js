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
html.octopus-light #pageRoot :is(.loc-dialog-shell,.rvw-dialog-shell,.gw3-modal-shell,.business-modal,.ore-panel,.atw-modal-shell),body.light #pageRoot :is(.loc-dialog-shell,.rvw-dialog-shell,.gw3-modal-shell,.business-modal,.ore-panel,.atw-modal-shell){color:#27313b!important}
html.octopus-light #pageRoot :is(.loc-dialog-shell,.rvw-dialog-shell,.gw3-modal-shell,.business-modal,.ore-panel,.atw-modal-shell) :is(h1,h2,h3,h4,label,p),body.light #pageRoot :is(.loc-dialog-shell,.rvw-dialog-shell,.gw3-modal-shell,.business-modal,.ore-panel,.atw-modal-shell) :is(h1,h2,h3,h4,label,p){color:#27313b!important;text-shadow:none!important}
html.octopus-light #v80nav :is(.oct-l-brand-mark,.oct-l-tenant-mark,.oct-l-user-mark),body.light #v80nav :is(.oct-l-brand-mark,.oct-l-tenant-mark,.oct-l-user-mark){background:#e6ebf2!important;color:#526170!important;border-color:#d2dae3!important}
html.octopus-light .sidebar .brand h1,body.light .sidebar .brand h1{color:#27323d!important;text-shadow:none!important}
html.octopus-light .sidebar .brand small,body.light .sidebar .brand small{color:#687582!important;text-shadow:none!important}
html.octopus-light .sidebar .brand-mark,body.light .sidebar .brand-mark{background:#e3e9ef!important;color:#526170!important;border:1px solid #d1d9e1!important;box-shadow:none!important}
html.octopus-light .sidebar .tenant,html.octopus-light .sidebar .user-card,body.light .sidebar .tenant,body.light .sidebar .user-card{background:#f7f9fb!important;color:#2d3843!important;border:1px solid #d7e0e7!important;box-shadow:none!important}
html.octopus-light .sidebar .tenant b,html.octopus-light .sidebar .user-card b,body.light .sidebar .tenant b,body.light .sidebar .user-card b{color:#2d3843!important;text-shadow:none!important}
html.octopus-light .sidebar .tenant small,html.octopus-light .sidebar .user-card small,body.light .sidebar .tenant small,body.light .sidebar .user-card small{color:#667481!important;text-shadow:none!important}
html.octopus-light .sidebar .tenant>i,html.octopus-light .sidebar .avatar,body.light .sidebar .tenant>i,body.light .sidebar .avatar{background:#e3e9ef!important;color:#526170!important;border:1px solid #d1d9e1!important;box-shadow:none!important}
html.octopus-light .sidebar .user-card>button,body.light .sidebar .user-card>button{color:#687582!important}
html.octopus-light #v80nav .v815gh small,body.light #v80nav .v815gh small{color:#687582!important}
`;
document.head.appendChild(s);
})();
