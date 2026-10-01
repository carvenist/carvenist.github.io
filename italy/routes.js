const WALK_ROUTES=[
 {id:'central',name:'중심가 · Navona → Pantheon → Trevi',stops:['navona','pantheon','trevi'],note:'10/3 야경 후보. Camillo·MONS와 연결하기 좋은 중심가 동선. 외관·광장 산책이며 미확정.'},
 {id:'tiber',name:'Tiber · Castel → St Peter',stops:['castel','conciliazione','stpeter'],note:'10/3 야경 후보. 강변과 St Peter 외관. 내부 입장 계획 아님, 현장 접근·보안 통제 확인.'},
 {id:'trastevere',name:'Trastevere · Santa Maria → Ponte Sisto',stops:['santamaria','trilussa','pontesisto'],note:'10/3 야경 후보. Trapizzino·Trilussa와 연결. 골목·광장·보행교 중심.'},
 {id:'ancient',name:'고대 로마 · Colosseum → Campidoglio',stops:['colosseum','fori','campidoglio'],note:'10/3 야경 후보. Suburra·Cimarra 대안과 비교. 조명·공사·보행 통제 미확인.'},
 {id:'pincio',name:'Pincio 공원 · 후순위',stops:['pincio'],note:'늦은 도착일에는 후순위. 핀은 공원 대표점, 전망대 출입구가 아님. 오르막·야간 접근 확인.'},
 {id:'departure',name:'10/4 · 점심 → 호텔 짐 회수 → Termini',stops:['termini'],note:'계획용 버퍼: 점심 12:30–13:45 → 짐 회수 14:00–14:30 → 역 이동 14:45 → Termini 15:15–15:25 도착 목표 → FR8317 15:57 출발. 실제 이동시간이 아닌 여유 목표이며, 호텔·점심 위치와 길찾기 결과에 맞춰 조정.'}
];
let routeChoice='central',routeHotel='',routeDinner='',routeLunch='',routeExpanded=false;
try{const prefs=JSON.parse(localStorage.getItem('italia-route-view-v1')||'{}');if(WALK_ROUTES.some(r=>r.id===prefs.route))routeChoice=prefs.route;routeHotel=prefs.hotel||'';routeDinner=prefs.dinner||'';routeLunch=prefs.lunch||''}catch{}
function routePoints(){
 const r=WALK_ROUTES.find(r=>r.id===routeChoice),hotel=findPlace(routeHotel),meal=findPlace(routeChoice==='departure'?routeLunch:routeDinner);
 const points=[];
 if(hotel)points.push({...hotel,routeLabel:hotel.name+' · 출발'});
 if(meal)points.push({...meal,routeLabel:meal.name+(routeChoice==='departure'?' · 점심 후보':' · 저녁 후보')});
 if(routeChoice==='departure'&&hotel)points.push({...hotel,routeLabel:hotel.name+' · 짐 회수(조건 미확인)'});
 for(const id of r.stops){const p=findPlace(id);if(p)points.push(p)}
 return points;
}
function walkingLink(points){
 const u=new URL('https://www.google.com/maps/dir/');u.searchParams.set('api','1');u.searchParams.set('travelmode','walking');
 const address=p=>p.address||p.name+', '+(p.city==='rome'?'Roma':'Bari')+', Italy';
 if(points.length>1)u.searchParams.set('origin',address(points[0]));
 u.searchParams.set('destination',address(points[points.length-1]));
 if(points.length>2)u.searchParams.set('waypoints',points.slice(1,-1).map(address).join('|'));
 return u.href;
}
function routeOptions(ids,value,placeholder){return '<option value="">'+placeholder+'</option>'+ids.map(id=>{const p=findPlace(id);return p?'<option value="'+id+'" '+(value===id?'selected':'')+'>'+escapeHTML(p.name)+'</option>':''}).join('')}
function renderRoutes(fit=false){
 const panel=$('#routeWorkspace');panel.hidden=city!=='rome';routeLayer.clearLayers();if(city!=='rome')return;
 const r=WALK_ROUTES.find(r=>r.id===routeChoice),points=routePoints(),departure=routeChoice==='departure';
 panel.innerHTML='<div class="route-heading"><strong>코스 · 후보 비교</strong><span>미예약 계획</span></div><label class="route-label">지도에서 비교할 코스<select id="routeChoice">'+WALK_ROUTES.map(x=>'<option value="'+x.id+'" '+(routeChoice===x.id?'selected':'')+'>'+escapeHTML(x.name)+'</option>').join('')+'</select></label>'+
 '<details id="routeDetails" '+(routeExpanded?'open':'')+'><summary>호텔·식당 연결과 순서 보기</summary><div class="route-fields"><label class="route-label">호텔 후보 (조식 포함 선호)<select id="routeHotel">'+routeOptions(['montecarlo','basilica','raffaello','domus-harmonia','lancelot'],routeHotel,'미선택 · 코스만 보기')+'</select></label><label class="route-label">'+(departure?'점심 후보':'저녁 후보')+'<select id="'+(departure?'routeLunch':'routeDinner')+'">'+routeOptions(departure?['roscioli','felice','camillo','trapizzino']:['camillo','mons','suburra','cimarra','trapizzino','mercato-centrale'],departure?routeLunch:routeDinner,'미선택 · 식사 제외')+'</select></label></div><p class="route-note">'+escapeHTML(r.note)+'</p>'+
 (departure&&!routeHotel?'<p class="route-warning">호텔을 선택하면 체크아웃 후 짐 회수 경유가 추가됩니다. 보관 가능 여부·비용·회수시간은 호텔 확인 필요.</p>':'')+
 (routeLunch==='roscioli'&&departure?'<p class="route-warning">Roscioli: 10/1 조회 시 10/4 1인 온라인 예약 불가. 실제 예약 없음.</p>':'')+
 '<ol class="route-stops">'+points.map((p,i)=>'<li><button type="button" data-route-place="'+p.id+'"><b>'+String(i+1).padStart(2,'0')+'</b><span>'+escapeHTML(p.routeLabel||p.name)+'</span></button></li>').join('')+'</ol>'+
 '<div class="route-links"><a href="'+escapeHTML(walkingLink(points))+'" target="_blank" rel="noopener">실제 도보 길찾기 ↗</a>'+(!departure&&routeHotel?'<a href="'+escapeHTML(walkingLink([points[points.length-1],findPlace(routeHotel)]))+'" target="_blank" rel="noopener">코스 끝 → 호텔 ↗</a>':'')+'</div>'+
 '<details class="route-leg-details"><summary>구간별 길찾기</summary>'+points.slice(1).map((p,i)=>'<a href="'+escapeHTML(walkingLink([points[i],p]))+'" target="_blank" rel="noopener">'+(i+1)+' → '+(i+2)+' '+escapeHTML(p.routeLabel||p.name)+' ↗</a>').join('')+'</details></details>'+
 '<p class="route-disclaimer">번호·점선은 방문 순서 연결선이며 실제 도보 경로가 아닙니다. 거리·시간·통제는 길찾기에서 확인하세요.</p>';
 if(points.length>1)L.polyline(points.map(p=>[p.lat,p.lng]),{color:'#bd762e',weight:3,dashArray:'5,8',opacity:.8,interactive:false}).addTo(routeLayer);
 points.forEach((p,i)=>L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:'<span class="route-pin">'+(i+1)+'</span>',iconSize:[30,30],iconAnchor:[15,15]}),title:(i+1)+'. '+p.name,zIndexOffset:500}).addTo(routeLayer).on('click',()=>{if(!picking)selectPlace(p.id)}));
 if(fit&&points.length){if(points.length===1)map.setView([points[0].lat,points[0].lng],15);else map.fitBounds(points.map(p=>[p.lat,p.lng]),{padding:[40,45],maxZoom:15});}
 $('#routeDetails').addEventListener('toggle',e=>{routeExpanded=e.target.open});
}
$('#routeWorkspace').addEventListener('change',e=>{
 const fields={routeChoice:v=>routeChoice=v,routeHotel:v=>routeHotel=v,routeDinner:v=>routeDinner=v,routeLunch:v=>routeLunch=v};
 if(!fields[e.target.id])return;fields[e.target.id](e.target.value);
 try{localStorage.setItem('italia-route-view-v1',JSON.stringify({route:routeChoice,hotel:routeHotel,dinner:routeDinner,lunch:routeLunch}))}catch{}
 renderRoutes(true);setTimeout(()=>map.invalidateSize(),100);
});
$('#routeWorkspace').addEventListener('click',e=>{const b=e.target.closest('[data-route-place]');if(b)selectPlace(b.dataset.routePlace)});
const renderPlaces=render;render=function(){renderPlaces();renderRoutes()};render();renderRoutes(true);
