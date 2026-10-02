const WALK_ROUTES=[
 {id:'return-home',name:'10/9 귀국 · Nicolaus → Bari → Roma → FCO',stops:['nicolaus','bari-station','termini','fco'],note:'택시·열차 이동 순서. 실제 운행 경로가 아닌 개략 연결선.'},
 {id:'memphis-night',name:'10/3 핵심 · 저녁 → Trevi → Memphis',stops:['trevi'],returnHotel:true,note:'21–22시 체크인 예상 후 저녁 → 22:30–23:15 Trevi 외부 야경 → 호텔 복귀. 시각은 계획 예시이며 입국·수하물·교통 상황에 따라 변경. 늦으면 식당 주방 확인, 체력이 없으면 야경도 생략.'},
 {id:'memphis-night-plus',name:'10/3 선택 확장 · Trevi → Quirinale',stops:['trevi','quirinale'],returnHotel:true,note:'핵심 야경 후 체력이 남을 때만 Quirinale 광장 외관 추가. 늦은 도착이면 핵심 코스만 선택.'},
 {id:'morning-shop',name:'10/4 A · Spagna·Margutta + 짧은 쇼핑',stops:['spagna','margutta','rinascente'],morning:true,note:'09:45–10:15 체크아웃·짐 보관(늦어도 11시 전) → Spagna·Via Margutta → 1–2곳만 쇼핑 → 12:30–13시 점심 → 14시 전후 호텔 짐 회수 → Termini 15:15 목표. 기본 지도는 Rinascente 1곳만 경유. Fabriano·OVS·Doppelgänger는 교체 후보, 모두 방문하는 계획 아님. 공휴일 운영 미확인; 닫으면 산책으로 변경.'},
 {id:'morning-view',name:'10/4 B · Spagna·Margutta + Popolo·Pincio',stops:['spagna','margutta','popolo','pincio-terrace'],morning:true,note:'쇼핑 대신 전망 산책. 체크아웃·짐 보관 후 Spagna → Via Margutta → Popolo → Pincio → 12:30–13시 점심 → 14시 전후 Memphis 짐 회수 → Termini 15:15 목표. 오르막·계단 포함, 피곤하거나 늦으면 전망대를 생략. 실제 길찾기 시간에 맞춰 일찍 출발.'},
 {id:'morning-pantheon',name:'10/4 C · Pantheon 외관·커피로 교체',stops:['pantheon','santeustachio'],morning:true,note:'Spagna·쇼핑·Pincio를 대신하는 대안. Pantheon 외관 + Sant’Eustachio 커피 → 점심 → 호텔 짐 회수 → Termini. 내부 입장 예약 없음; 다른 오전 코스에 모두 추가하지 않기.'},
 {id:'central',name:'중심가 · Navona → Pantheon → Trevi',stops:['navona','pantheon','trevi'],note:'10/3 야경 후보. Camillo·MONS와 연결하기 좋은 중심가 동선. 외관·광장 산책이며 미확정.'},
 {id:'tiber',name:'Tiber · Castel → St Peter',stops:['castel','conciliazione','stpeter'],note:'10/3 야경 후보. 강변과 St Peter 외관. 내부 입장 계획 아님, 현장 접근·보안 통제 확인.'},
 {id:'trastevere',name:'Trastevere · Santa Maria → Ponte Sisto',stops:['santamaria','trilussa','pontesisto'],note:'10/3 야경 후보. Trapizzino·Trilussa와 연결. 골목·광장·보행교 중심.'},
 {id:'ancient',name:'고대 로마 · Colosseum → Campidoglio',stops:['colosseum','fori','campidoglio'],note:'10/3 야경 후보. Suburra·Cimarra 대안과 비교. 조명·공사·보행 통제 미확인.'},
 {id:'pincio',name:'Pincio 공원 · 후순위',stops:['pincio'],note:'늦은 도착일에는 후순위. 핀은 공원 대표점, 전망대 출입구가 아님. 오르막·야간 접근 확인.'},
 {id:'departure',name:'10/4 · 점심 → 호텔 짐 회수 → Termini',stops:['termini'],note:'계획용 버퍼: 점심 12:30–13:45 → 짐 회수 14:00–14:30 → 역 이동 14:45 → Termini 15:15–15:25 도착 목표 → FR8317 15:57 출발. 실제 이동시간이 아닌 여유 목표이며, 호텔·점심 위치와 길찾기 결과에 맞춰 조정.'}
];
let routeChoice='memphis-night',routeHotel='memphis',routeDinner='piccolo-arancio',routeLunch='baccano',routeExpanded=false;
try{const prefs=JSON.parse(localStorage.getItem('italia-route-view-v1')||'{}');if(WALK_ROUTES.some(r=>r.id===prefs.route))routeChoice=prefs.route;routeHotel=prefs.hotel||'memphis';routeDinner=prefs.dinner||'piccolo-arancio';routeLunch=prefs.lunch||'baccano'}catch{}
function routePoints(){
 if(routeChoice==='return-home')return ['nicolaus','bari-station','termini','fco'].map(id=>findPlace(id));
 const r=WALK_ROUTES.find(r=>r.id===routeChoice),hotel=findPlace(routeHotel),departure=r.id==='departure',meal=findPlace(departure||r.morning?routeLunch:routeDinner),points=[];
 if(hotel)points.push({...hotel,routeLabel:hotel.name+(r.morning?' · 체크아웃·짐 보관':' · 출발')});
 if(meal&&!r.morning)points.push({...meal,routeLabel:meal.name+(departure?' · 점심 추천 (미예약)':' · 저녁 추천 (미예약)')});
 for(const id of r.stops){const p=findPlace(id);if(p&&id!=='termini')points.push(p)}
 if(r.morning&&meal)points.push({...meal,routeLabel:meal.name+' · 12:30–13시 점심 추천 (미예약)'});
 if((departure||r.morning||r.returnHotel)&&hotel)points.push({...hotel,routeLabel:hotel.name+(departure||r.morning?' · 14시 전후 짐 회수'+(hotel.id==='memphis'?' (무료 보관)':' (보관 조건 확인)'):' · 복귀')});
 if(departure||r.morning){const p=findPlace('termini');points.push({...p,routeLabel:'Termini · 15:15 목표 / FR8317 15:57 출발'})}
 return points;
}
function walkingChunks(points){
 const chunks=[];for(let i=0;i<points.length-1;i+=4)chunks.push(points.slice(i,i+5));
 return chunks.length?chunks:[points];
}

function returnPlanHTML(){return '<details class="return-plan" '+(dayFilter==='10.9'?'open':'')+'><summary><b>10/9 금 · 귀국 시간·이동</b><span>08:40 Bari → 13:15 Roma / 21:15 FCO 출발</span></summary><ol class="day-timeline"><li><b>07:50 → 08:10 목표</b> Nicolaus 체크아웃 → 택시로 Bari Centrale. 계획용 시각으로 교통·짐 이동에 맞춰 조정.</li><li><b>08:40 → 13:15 확정</b> Frecciarossa 8306 Bari Centrale → Roma Termini · Standard Economy €46.90 · 발권 완료.</li><li><b>13:15 이후 여유</b> 로마 점심·카페·휴식. 16시 전후 Termini 복귀 목표, 짐·승강장 이동 여유 확보.</li><li><b>16:35 → 17:07 추천·미구매</b> Leonardo Express Roma Termini → FCO · €14. 판매표 확인 추천안, 구매·운행 재확인 필요.</li><li><b>17시대 공항 도착</b> 터미널 이동 후 체크인·짐 위탁·보안검색·출국 수속. 공항역 17:07 도착 기준 출발까지 약 4시간 8분의 여유. 실제 카운터 오픈 시간 미확인.</li><li><b>10/9 21:15 FCO → 10/10 16:10 ICN</b> 출발은 이탈리아 Europe/Rome CEST(UTC+2), 도착은 한국 Asia/Seoul KST(UTC+9). 항공 도착은 다음 날.</li></ol><p class="route-warning">10/6–23 공항철도 일부 시간 변경·취소 및 대체버스 공지. 출발 전 운행 확인, 변경 시 로마 휴식 시간을 줄이고 공항 이동을 앞당기세요.</p><button type="button" class="plan-route-button" data-plan-route="return-home">귀국 이동 순서 지도에 보기</button> <a class="plan-source" href="https://www.trenitalia.com/it/informazioni/lavori-programmati/20261006-linee-roma-termini-fiumicino-aeroporto-roma-velletri-roma-pisa.html" target="_blank" rel="noopener">공항철도 공식 변경 공지 ↗</a></details>';}
function renderReturnRoute(fit){
 const panel=$('#routeWorkspace');panel.hidden=false;const points=routePoints();routeLayer.clearLayers();
 const driving=new URL(walkingLink(points.slice(0,2)));driving.searchParams.set('travelmode','driving');driving.searchParams.set('destination','Bari Centrale, Bari, Italy');
 panel.innerHTML='<div class="route-heading"><strong>10/9 귀국 · 택시·열차 연결</strong></div><ol class="route-stops">'+points.map((p,i)=>'<li><button type="button" data-route-place="'+p.id+'"><b>'+(i+1)+'</b><span>'+escapeHTML(p.name)+'</span></button></li>').join('')+'</ol><div class="route-links"><a href="'+escapeHTML(driving.href)+'" target="_blank" rel="noopener">Nicolaus → 역 차량 길찾기 ↗</a><a href="https://www.trenitalia.com/en.html" target="_blank" rel="noopener">열차 운행·시간표 확인 ↗</a></div><p class="route-disclaimer">점선은 도시 간 이동 순서이며 실제 도로·철도 경로가 아닙니다. Nicolaus→Bari 역은 택시, Bari→Roma는 FR8306, Roma→FCO는 추천 공항철도(미구매)입니다.</p><button type="button" class="plan-route-button" data-plan-route="memphis-night">10/3 로마 동선으로 돌아가기</button>';
 L.polyline(points.map(p=>[p.lat,p.lng]),{color:'#bd762e',weight:3,dashArray:'5,8',opacity:.8,interactive:false}).addTo(routeLayer);
 points.forEach((p,i)=>L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:'<span class="route-pin">'+(i+1)+'</span>',iconSize:[30,30],iconAnchor:[15,15]}),title:(i+1)+'. '+p.name}).addTo(routeLayer).on('click',()=>{if(!picking)selectPlace(p.id)}));
 if(fit)map.fitBounds(points.map(p=>[p.lat,p.lng]),{padding:[40,45]});
}

function renderTripOverview(){
 const panel=$('#tripOverview');panel.hidden=false;
 if(city==='bari'){panel.innerHTML='<div class="booked-heading"><span>10/4–5 확정 숙소</span><button type="button" data-route-place="bari-moderno">Hotel Moderno ↗</button></div><p class="booking-summary">성인 1인 · Superior Single · 전용 욕실 · 조식 포함<br>결제 승인·호텔 예약 확인 완료 · 총 €142.80<br><small>현장 도시세 €2 포함 · 환불·변경 불가</small></p><p class="route-note"><b>10/4</b> Bari Centrale 20:20 도착 → Moderno 21시 체크인 예상 → 저녁. 도착시각은 교통·짐 이동에 따라 달라집니다.</p><p class="route-note"><b>10/5</b> 조식·시내 산책 → 11시 전 Moderno 체크아웃·짐 보관 → 점심·짐 회수 → 택시로 Nicolaus 13시 도착 목표 → 짐 보관 요청·배지 수령 → 13:45 행사장 → GEMINI 14:00–17:45 참석 예정 후보 → 종료 후 객실 체크인.</p><p class="route-note">Moderno 체크아웃 후 짐 보관 시간·비용, Nicolaus 체크인 전 짐 보관·월요일 등록데스크 시간은 확인 필요. Nicolaus 일반 체크인 15시부터, 조기 입실 보장 없음.</p>'+returnPlanHTML();return;}
 const expanded=[...panel.querySelectorAll('.daily-plan')].map(d=>d.open);
 panel.innerHTML=`<div class="booked-heading"><span>확정 숙소</span><button type="button" data-route-place="memphis">Hotel Memphis ↗</button></div>
 <p class="booking-summary">10/3–4 · 결제·예약 완료 · 조식 포함<br>Single Room 13㎡ / 전용 욕실 · 총 €186.85<br><small>Agoda €179.35 + 현장 €7.50 · 환불·변경 불가</small></p>
 <p class="arrival-alert">체크인 14–23시 · 23시 이후 도착 예상 시 호텔에 연락</p>
 <details class="daily-plan"><summary><b>10/3 토 · 도착 → 저녁 → Trevi 야경</b><span>19:15 도착 / 21–22시 체크인 예상</span></summary>
 <ol class="day-timeline"><li><b>19:15</b> FCO 도착 → 입국·수하물 수령 → Leonardo Express로 Termini → Memphis. 마지막 구간은 짐·실제 도착시각에 맞춰 택시 또는 길찾기 확인.</li><li><b>21–22시 예상</b> 호텔 체크인. 도착 보장 시각이 아니며 지연 시 호텔에 연락.</li><li><b>체크인 후</b> Piccolo Arancio 우선, Il Chianti·Piccolo Buco는 대안. 모두 미예약; 늦으면 주방 주문 가능 여부 확인. 피자 대기가 길면 생략.</li><li><b>22:30–23:15 예시</b> Trevi 외부 야경 → Memphis 복귀. 외부는 무료; 내부 €2 구역(토·일 09–22시, 마지막 입장 21시)과 구분.</li></ol>
 <p class="route-note">핵심은 저녁과 Trevi. Quirinale 광장은 체력이 남을 때만 선택 확장.</p><button type="button" class="plan-route-button" data-plan-route="memphis-night">핵심 야경 동선 지도에 보기</button>
 <a class="plan-source" href="https://www.fontanaditrevi.roma.it/" target="_blank" rel="noopener">Trevi 공식 관람 안내 ↗</a></details>
 <details class="daily-plan"><summary><b>10/4 일 · 아침 → 산책/쇼핑 → 바리</b><span>11시 전 체크아웃 / Termini 15:15 목표</span></summary>
 <ol class="day-timeline"><li><b>08:30–09:15 예시</b> Luna by Faro 또는 TreCaffè 외부 아침. 포함된 호텔 조식(07–10시)을 이용하면 외부 아침 생략. 아침 영업·공휴일 운영 재확인.</li><li><b>09:45–10:15 목표</b> Memphis 체크아웃·무료 짐 보관. 늦어도 11시 전 완료, 짐 회수시각 호텔에 알리기.</li><li><b>오전 핵심</b> Spagna → Via Margutta. <strong>A 짧은 쇼핑 1–2곳</strong> 또는 <strong>B Popolo·Pincio 전망 산책</strong> 중 하나. Pantheon·Sant’Eustachio는 전체 오전 코스를 교체하는 C 대안.</li><li><b>12:30–13시 시작</b> Baccano 점심 추천(미예약), 13:45 전후 종료 목표.</li><li><b>14시 전후</b> 호텔 짐 회수 → 역 이동. 15:15 Termini 도착 목표로 실제 길찾기·짐 이동 여유 확보.</li><li><b>15:57 → 20:20</b> FR8317 Roma Termini → Bari Centrale · Standard/Base €61 예약·발권 완료. 10/4–5 Hotel Moderno 예약 완료. 20:20 역 도착 → 21시 체크인 예상 → 저녁.</li></ol>
 <p class="route-warning">10/4는 2026년부터 국가 공휴일. 매장 통상 일요일 영업이 당일 개장을 보장하지 않습니다. Castroni는 휴일 휴무 안내로 필수 동선 제외.</p>
 <div class="plan-branch-buttons"><button type="button" data-plan-route="morning-shop">A 쇼핑 동선</button><button type="button" data-plan-route="morning-view">B 전망 동선</button><button type="button" data-plan-route="morning-pantheon">C Pantheon 대안</button></div>
 <div class="plan-small-links"><a href="${escapeHTML(walkingLink([findPlace('memphis'),findPlace('luna'),findPlace('memphis')]))}" target="_blank" rel="noopener">Luna 아침 왕복 ↗</a><a href="${escapeHTML(walkingLink([findPlace('memphis'),findPlace('trecaffe'),findPlace('memphis')]))}" target="_blank" rel="noopener">TreCaffè 아침 왕복 ↗</a></div>
 <p class="route-note">관광 시각은 계획용 여유 목표입니다. 식당·매장은 미예약, 현장 상황과 실제 이동시간에 맞춰 줄이세요.</p></details>`;
 panel.insertAdjacentHTML('beforeend',returnPlanHTML());
 panel.querySelectorAll('.daily-plan').forEach((d,i)=>{d.open=!!expanded[i]});
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
 renderTripOverview();if(routeChoice==='return-home'){renderReturnRoute(fit);return;}const panel=$('#routeWorkspace');panel.hidden=city!=='rome';routeLayer.clearLayers();if(city!=='rome')return;
 const r=WALK_ROUTES.find(r=>r.id===routeChoice),points=routePoints(),departure=routeChoice==='departure'||r.morning;
 panel.innerHTML='<div class="route-heading"><strong>동선 지도 · 선택 비교</strong><span>식당·관광은 미확정</span></div><label class="route-label">지도에서 비교할 코스<select id="routeChoice">'+WALK_ROUTES.map(x=>'<option value="'+x.id+'" '+(routeChoice===x.id?'selected':'')+'>'+escapeHTML(x.name)+'</option>').join('')+'</select></label>'+
 '<details id="routeDetails" '+(routeExpanded?'open':'')+'><summary>호텔·식당 연결과 순서 보기</summary><div class="route-fields"><label class="route-label">지도 비교 호텔 (확정: Memphis)<select id="routeHotel">'+routeOptions(['memphis','pace-helvezia','abruzzi','montecarlo','basilica','madison','virgilio','rome-times','exe-domus','raffaello','domus-harmonia','lancelot'],routeHotel,'미선택 · 코스만 보기')+'</select></label><label class="route-label">'+(departure?'점심 후보':'저녁 후보')+'<select id="'+(departure?'routeLunch':'routeDinner')+'">'+routeOptions(departure?['baccano','piccolo-arancio','chianti','roscioli','felice','camillo','trapizzino']:['piccolo-arancio','chianti','piccolo-buco','baccano','camillo','mons','suburra','cimarra','trapizzino','mercato-centrale'],departure?routeLunch:routeDinner,'미선택 · 식사 제외')+'</select></label></div><p class="route-note">'+escapeHTML(r.note)+'</p>'+
 (departure&&!routeHotel?'<p class="route-warning">호텔을 선택하면 체크아웃 후 짐 회수 경유가 추가됩니다. 보관 가능 여부·비용·회수시간은 호텔 확인 필요.</p>':'')+
 (routeLunch==='roscioli'&&departure?'<p class="route-warning">Roscioli: 10/1 조회 시 10/4 1인 온라인 예약 불가. 실제 예약 없음.</p>':'')+
 '<ol class="route-stops">'+points.map((p,i)=>'<li><button type="button" data-route-place="'+p.id+'"><b>'+String(i+1).padStart(2,'0')+'</b><span>'+escapeHTML(p.routeLabel||p.name)+'</span></button></li>').join('')+'</ol>'+
 '<div class="route-links">'+walkingChunks(points).map((chunk,i)=>'<a href="'+escapeHTML(walkingLink(chunk))+'" target="_blank" rel="noopener">'+(points.length>5?'실제 도보 '+(i*4+1)+' → '+Math.min(i*4+5,points.length):'실제 도보 길찾기')+' ↗</a>').join('')+(!departure&&routeHotel&&!r.returnHotel?'<a href="'+escapeHTML(walkingLink([points[points.length-1],findPlace(routeHotel)]))+'" target="_blank" rel="noopener">코스 끝 → 호텔 ↗</a>':'')+'</div>'+
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
function routeClick(e){const b=e.target.closest('[data-route-place]');if(b)selectPlace(b.dataset.routePlace);const choice=e.target.closest('[data-plan-route]');if(choice){routeChoice=choice.dataset.planRoute;routeHotel='memphis';routeExpanded=true;renderRoutes(true);$('#routeWorkspace').scrollIntoView({block:'start',behavior:'smooth'});setTimeout(()=>map.invalidateSize(),120)}}
$('#routeWorkspace').addEventListener('click',routeClick);
$('#tripOverview').addEventListener('click',routeClick);
const renderPlaces=render;render=function(){renderPlaces();renderRoutes()};render();renderRoutes(true);
