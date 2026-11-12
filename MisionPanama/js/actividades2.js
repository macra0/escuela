/* Segundo grado: 24 actividades con juegos y fotos */

    // --- 1B. ACTIVIDADES DE SEGUNDO GRADO (24 juegos interactivos) ---
    // Para usar una foto propia en una actividad, agrega  photo:'https://...jpg'  al objeto de la actividad.
    const IMG_BANKS = [
      ['Pexels','https://www.pexels.com/es-es/buscar/'],
      ['Unsplash','https://unsplash.com/es/s/fotos/'],
      ['Wikimedia','https://commons.wikimedia.org/w/index.php?ns6=1&search='],
      ['Google Imágenes','https://www.google.com/search?tbm=isch&q=']
    ];
    // ===== FOTOS REALES: se buscan en Wikimedia Commons al abrir cada actividad (requiere internet) =====
    // Si una foto no carga, se muestra el emoji. Cada nombre de elemento -> término de búsqueda de la foto.
    const IMGQ = {
      'Agricultor':'agricultor Panamá cultivo','Ganadero':'ganadería Panamá vacas','Pescador':'pescador Panamá','Obrero de fábrica':'obrero fábrica','Vendedora del mercado':'mercado Panamá vendedora',
      'Leche':'vaso de leche','Arroz':'arrozal','Pescado':'pescado fresco','Miel':'miel de abeja frasco','Ropa':'ropa confección fábrica',
      'Plantar árboles':'reforestación plantar árbol','Reciclar':'reciclaje contenedores','Quemar los bosques':'incendio forestal','Cortar árboles sin control':'deforestación tala',
      'Automóvil':'automóvil carro','Autobús':'autobús Ciudad de Panamá','Tren':'Panama Canal Railway tren','Barco':'barco Canal de Panamá','Lancha':'lancha bote motor','Avión':'avión Copa Airlines','Helicóptero':'helicóptero',
      'Médico':'médico doctor','Maestro':'maestro escuela aula','Bombero':'bombero Panamá','Conductor':'conductor autobús',
      'Pueblos indígenas':'Guna Yala mujeres molas','Afrodescendientes':'afropanameños cultura','Mestizos':'Panamá gente folclore','Comunidad china':'chino panameño barrio chino Panamá','Comunidad indostana':'templo hindú Panamá','Comunidad europea':'Casco Viejo Panamá',
      'Comprar productos':'mercado Panamá','Celebrar una fiesta tradicional':'festival folclórico Panamá','Ayudar a otra comunidad':'voluntarios ayuda comunidad','Participar en un campeonato':'béisbol Panamá',
      'Destruir su hábitat':'deforestación','Proteger los bosques':'bosque tropical Panamá','Contaminar los ríos':'río contaminado basura','Cazar animales':'caza',
      'Ahorrar agua':'grifo agua ahorro','Desperdiciar electricidad':'bombilla luz','Casa de paja':'bohío casa de paja','Carreta con caballo':'carreta caballo','Rascacielos':'Ciudad de Panamá rascacielos','Metro':'Metro de Panamá',
      'Camino de tierra':'camino de tierra','Casas antiguas':'casas coloniales Casco Viejo','Transporte antiguo':'tranvía antiguo Panamá','Camino pavimentado':'carretera asfaltada','Edificios modernos':'Ciudad de Panamá edificios','Transporte actual':'Metrobús Panamá',
      'Fundación de la ciudad de Panamá · 1519':'Panamá Viejo ruinas','Independencia de España · 1821':'Independencia de Panamá de España 1821','Separación de Colombia · 1903':'separación de Panamá 1903','Inauguración del Canal · 1914':'Canal de Panamá 1914 construcción',
      'Pollera':'pollera panameña','Montuno':'montuno panameño','Sombrero pintao':'sombrero pintao','Tembleques':'tembleques pollera',
      'Cumbia':'cumbia panameña baile','Tamborito':'tamborito Panamá','Diablicos':'diablico sucio Corpus Christi','Congos':'congos Portobelo','Breakdance':'breakdance','Patinaje artístico':'patinaje artístico',
      'Tamales':'tamal panameño','Carimañolas':'carimañola','Rondón':'rondón Panamá','Chicheme':'chicheme','Arroz con pollo':'arroz con pollo','Sushi':'sushi','Hamburguesa':'hamburguesa',
      'Mola':'mola Guna','Máscaras de diablicos':'máscara diablico','Chácaras':'chácara Panamá','Cutarras':'cutarras Panamá','Teléfono celular':'teléfono celular','Juguete de plástico':'juguete plástico',
      'Imagen de la bandera':'Flag of Panama','Imagen del escudo':'Coat of arms of Panama','Notas musicales':'partitura notas musicales'
    };
    const IMG_CACHE = (() => { try { return JSON.parse(localStorage.getItem('misionImgCache')) || {}; } catch (e) { return {}; } })();
    const IMG_PEND = {};
    async function findImg(q) {
      const tryQ = async term => {
        const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url%7Cmime&iiurlwidth=420&gsrsearch=' + encodeURIComponent(term);
        const r = await (await fetch(u)).json();
        const pages = Object.values((r.query && r.query.pages) || {}).sort((a, b) => a.index - b.index);
        for (const p of pages) { const i = p.imageinfo && p.imageinfo[0]; if (i && /^image\/(jpeg|png|webp|svg)/.test(i.mime) && i.thumburl) return i.thumburl; }
        return '';
      };
      try { const url = (await tryQ(q + ' filetype:bitmap')) || (await tryQ(q)); IMG_CACHE[q] = url; if (url) localStorage.setItem('misionImgCache', JSON.stringify(IMG_CACHE)); return url; }
      catch (e) { return ''; }
    }
    function setImg(el, url, q) {
      if (!url || !el.isConnected || el.querySelector('img')) return;
      const im = document.createElement('img'); im.src = url; im.alt = q; im.referrerPolicy = 'no-referrer';
      im.onerror = () => im.remove(); el.appendChild(im);
    }
    function hydrate() {
      app.querySelectorAll('.ph[data-q]').forEach(el => {
        const q = el.dataset.q;
        if (IMG_CACHE[q]) return setImg(el, IMG_CACHE[q], q);
        (IMG_PEND[q] = IMG_PEND[q] || findImg(q)).then(u => setImg(el, u, q));
      });
    }
    const ph = (name, emo, big) => (!emo && !IMGQ[name]) ? '' : `<span class="ph ${big ? 'big' : ''}" ${IMGQ[name] ? `data-q="${esc(IMGQ[name])}"` : ''}><i>${emo}</i></span>`;
    const gallery = t => `<div class="gal">${(t.imgs || []).map(s => `<figure><span class="ph big" data-q="${esc(s)}"><i>${t.emoji}</i></span><figcaption>${esc(s)}</figcaption></figure>`).join('')}</div><p class="credit">📷 Fotos de Wikimedia Commons (requiere internet).</p>`;

    // Constructores de juegos: C=clasificar/relacionar, O=ordenar, M=memoria, H=elegir, S=escena (encontrar)
    const uniq = a => [...new Set(a)];
    const C = (q, items, cats) => ({ type:'classify', q, items, cats: cats || uniq(items.map(i => i[2])) });
    const O = (q, items) => ({ type:'order', q, items });
    const M = (q, items) => ({ type:'memory', q, items });
    const H = (q, opts, multi, why) => ({ type:'choice', q, opts, multi: !!multi, why: why || '' });
    const S = (q, bg, spots) => ({ type:'scene', q, bg, spots });
    const A = (title, emoji, desc, tema, juego, imgs, games) =>
      ({ title, emoji, desc, tema, juego, imgs, games, act: true, lesson: '', points: [], questions: [] });

    const SKY = 'linear-gradient(#bfe8ff 0%,#dff6ff 40%,#9be3a8 41%,#4fbf6b 100%)';
    const MAPBG = 'linear-gradient(#5ec3f0 0%,#5ec3f0 30%,#8fd27a 31%,#8fd27a 66%,#2f7fd6 67%,#2f7fd6 100%)';

    const topics2 = {
      Geografía: [
        A('¿A qué se dedica cada persona?','👨‍🌾','Clasifica a los trabajadores de la comunidad.','Actividades económicas de la comunidad','Arrastrar y clasificar imágenes',
          ['Agricultura en Panamá','Ganadería en Panamá','Pesca en Panamá','Comercio en Panamá'],
          [C('Observa las imágenes y coloca cada trabajador en su actividad correspondiente.',[
            ['Agricultor','👨‍🌾','Agricultura'],['Ganadero','🤠','Ganadería'],['Pescador','🎣','Pesca'],['Obrero de fábrica','👷','Industria'],['Vendedora del mercado','🛒','Comercio']])]),
        A('¿De dónde vienen los productos?','🥛','Une cada producto con su actividad.','Actividades económicas','Relacionar imágenes',
          ['Cultivos de arroz en Panamá','Ganadería en Panamá','Apicultura miel','Fábricas'],
          [C('Une cada producto con la actividad que permite obtenerlo.',[
            ['Leche','🥛','Ganadería'],['Arroz','🍚','Agricultura'],['Pescado','🐟','Pesca'],['Miel','🍯','Apicultura'],['Ropa','👕','Industria']])]),
        A('Detectives de los recursos naturales','🔍','Encuentra los recursos en el paisaje.','Recursos naturales','Encontrar elementos en una ilustración',
          ['Ríos de Panamá','Montañas de Panamá','Bosques de Panamá','Animales de Panamá'],
          [S('Observa el paisaje y encuentra cinco recursos naturales.',SKY,[
            ['Agua','🌊',16,74],['Árboles','🌳',46,48],['Montañas','⛰️',78,26],['Suelo','🟫',34,90],['Animales','🦜',70,70]])]),
        A('¿Cómo cuidamos nuestros bosques?','🌳','Elige las acciones que protegen los bosques.','Conservación de los recursos naturales','Seleccionar imágenes correctas',
          ['Reforestación Panamá','Reciclaje','Protección ambiental bosques'],
          [H('¿Cuáles de estas acciones ayudan a proteger los bosques? (elige las correctas)',[
            ['Plantar árboles','🌱',1],['Reciclar','♻️',1],['Quemar los bosques','🔥',0],['Cortar árboles sin control','🪓',0]],true,'¡Plantar árboles y reciclar protege los bosques!')]),
        A('Clasifica los medios de transporte','🚆','Terrestres, acuáticos y aéreos.','Vías de comunicación y transporte','Arrastrar imágenes a tres categorías',
          ['Ferrocarril de Panamá','Canal de Panamá barcos','Aviación Panamá aeropuerto Tocumen'],
          [C('Coloca cada medio de transporte en el grupo correcto.',[
            ['Automóvil','🚗','Terrestres'],['Autobús','🚌','Terrestres'],['Tren','🚆','Terrestres'],['Barco','🚢','Acuáticos'],['Lancha','🚤','Acuáticos'],['Avión','✈️','Aéreos'],['Helicóptero','🚁','Aéreos']])]),
        A('Encuentra las vías de comunicación','🌉','Ubica cada vía en la ilustración.','Vías terrestres y acuáticas','Completar un paisaje con etiquetas',
          ['Puentes de Panamá','Canal de Panamá','Ferrocarril de Panamá','Carreteras de Panamá'],
          [S('Encuentra el nombre en la ilustración y tócalo.',SKY,[
            ['Carretera','🛣️',20,88],['Puente','🌉',50,58],['Río','🏞️',16,60],['Ferrocarril','🚆',78,82],['Canal de Panamá','🚢',80,52]])]),
        A('¿Qué servicio necesita la comunidad?','🧑‍⚕️','Une cada trabajador con su servicio.','Ocupaciones y oficios','Relacionar profesiones con sus beneficios',
          ['Médicos Panamá','Maestros Panamá','Agricultores Panamá','Bomberos Panamá'],
          [C('Une cada trabajador con el servicio que ofrece.',[
            ['Médico','🧑‍⚕️','Cuida la salud'],['Maestro','🧑‍🏫','Enseña'],['Agricultor','👨‍🌾','Cultiva alimentos'],['Bombero','🧑‍🚒','Ayuda en emergencias'],['Conductor','🚌','Transporta personas']])]),
        A('Conocemos nuestra diversidad cultural','🤝','Descubre las culturas de Panamá.','Grupos humanos de la comunidad','Memoria de imágenes y reconocimiento',
          ['Pueblos indígenas de Panamá','Cultura y folclore panameño','Panamá multicultural'],
          [M('Encuentra las parejas: cada imagen con su grupo cultural.',[
            ['Pueblos indígenas','🪶'],['Afrodescendientes','✊'],['Mestizos','🤝'],['Comunidad china','🏮'],['Comunidad indostana','🪔'],['Comunidad europea','🏰']])]),
        A('¿Cómo se relacionan las comunidades?','🏟️','Clasifica las relaciones entre comunidades.','Relaciones económicas, sociales y culturales','Clasificar situaciones',
          ['Deportes Panamá','Festividades Panamá','Mercados Panamá'],
          [C('Selecciona el tipo de relación que representa cada situación.',[
            ['Comprar productos','🛍️','Económica'],['Celebrar una fiesta tradicional','🎊','Cultural'],['Ayudar a otra comunidad','🤲','Social'],['Participar en un campeonato','🏆','Deportiva']])]),
        A('Protejamos al águila harpía','🦅','Aprende a proteger al ave nacional.','Fauna y desarrollo sostenible','Cuestionario visual de conservación',
          ['Águila harpía Panamá','Harpy eagle National Geographic'],
          [H('¿Qué debemos hacer para proteger al águila harpía?',[
            ['Destruir su hábitat','🪓',0],['Proteger los bosques','🌳',1],['Contaminar los ríos','🛢️',0],['Cazar animales','🎯',0]],false,'¡Correcto! El águila harpía vive en bosques sanos.')]),
        A('El planeta necesita nuestra ayuda','🚦','Semáforo ecológico.','Desarrollo sostenible y ODS','Semáforo ecológico',
          ['Ahorro de agua','Energía solar','Conservación ambiental'],
          [C('Clasifica cada acción según ayude o perjudique al planeta.',[
            ['Ahorrar agua','🚰','🟢 Verde: ayuda'],['Reciclar','♻️','🟢 Verde: ayuda'],['Contaminar los ríos','🛢️','🔴 Rojo: perjudica'],['Desperdiciar electricidad','💡','🔴 Rojo: perjudica'],['Plantar árboles','🌳','🟢 Verde: ayuda']])]),
        A('Aventura por el mapa de Panamá','🗺️','Ubica lugares en el mapa.','Ubicación geográfica y comunidad','Mapa interactivo con puntos para seleccionar',
          ['Mapa de Panamá','Mapa físico de Panamá','Canal de Panamá'],
          [S('Esquema de Panamá: toca cada lugar que se te pide.',MAPBG,[
            ['Panamá','🇵🇦',32,48],['Mar Caribe','🌊',50,12],['Canal de Panamá','🚢',62,48],['Océano Pacífico','🐋',50,86]])])
      ],
      Historia: [
        A('¿Cómo era nuestra comunidad antes?','🏘️','Compara comunidades antiguas y modernas.','Historia de la comunidad','Comparar imágenes de antes y después',
          ['Panamá antiguo fotografías','Ciudad de Panamá moderna'],
          [C('¿Cuáles imágenes representan una comunidad antigua y cuáles una moderna?',[
            ['Casa de paja','🛖','Comunidad antigua'],['Carreta con caballo','🐴','Comunidad antigua'],['Rascacielos','🏙️','Comunidad moderna'],['Metro','🚇','Comunidad moderna']])]),
        A('Descubrimos a los primeros pobladores','🪶','¿Quiénes vivían aquí antes?','Origen de la comunidad y primeros habitantes','Selección de imágenes y reconocimiento',
          ['Pueblos indígenas de Panamá','Cultura Guna','Cultura Emberá'],
          [H('¿Quiénes vivían en estas tierras antes de la llegada de los europeos?',[
            ['Los pueblos indígenas','🪶',1],['Los astronautas','🧑‍🚀',0],['Los habitantes de otros planetas','👽',0]])]),
        A('Los cambios de nuestra comunidad','🛣️','Antes y ahora.','Cambios en el paisaje natural y cultural','Ordenar imágenes del pasado al presente',
          ['Panamá antiguo','Panamá actual'],
          [C('Organiza cada imagen según la época que representa.',[
            ['Camino de tierra','🟤','Pasado'],['Casas antiguas','🛖','Pasado'],['Transporte antiguo','🐴','Pasado'],['Camino pavimentado','🛣️','Presente'],['Edificios modernos','🏢','Presente'],['Transporte actual','🚌','Presente']])]),
        A('¿Qué pasó primero?','⏳','Línea del tiempo de Panamá.','Fechas históricas de Panamá','Línea del tiempo interactiva',
          ['Fundación de Panamá 1519','Independencia de Panamá de España 1821','Separación de Panamá de Colombia 1903','Canal de Panamá 1914'],
          [O('Toca los acontecimientos en orden, del más antiguo al más reciente.',[
            ['Fundación de la ciudad de Panamá · 1519','⛪'],['Independencia de España · 1821','🕊️'],['Separación de Colombia · 1903','🇵🇦'],['Inauguración del Canal · 1914','🚢']])]),
        A('Conocemos las fechas patrias','📅','Une cada fecha con su acontecimiento.','Fechas históricas importantes','Relacionar fechas con acontecimientos',
          ['Independencia de Panamá','Separación de Panamá 3 de noviembre','9 de enero de 1964 Panamá'],
          [C('Une cada fecha con el acontecimiento que representa.',[
            ['10 de noviembre','📅','Primer Grito de Independencia'],['28 de noviembre','📅','Independencia de España'],['3 de noviembre','📅','Separación de Colombia'],['5 de noviembre','📅','Consolidación de la separación en Colón'],['9 de enero','📅','Gesta patriótica de 1964']])]),
        A('El Canal de Panamá: un acontecimiento histórico','🚢','¿Cuándo se inauguró el Canal?','Inauguración del Canal de Panamá','Completar una pregunta con imágenes',
          ['Canal de Panamá construcción histórica','Esclusas del Canal de Panamá','Autoridad del Canal de Panamá fotografías'],
          [H('¿En qué año se inauguró el Canal de Panamá?',[['1519','⛪',0],['1821','🕊️',0],['1914','🚢',1]],false,'El Canal conectó los océanos Atlántico y Pacífico con una vía de navegación.')]),
        A('Descubrimos nuestra vestimenta típica','👗','Encuentra las parejas.','Cultura e identidad nacional','Memoria de parejas',
          ['Pollera panameña','Montuno panameño','Sombrero pintao','Tembleques'],
          [M('Encuentra las parejas de prendas de la vestimenta tradicional panameña.',[
            ['Pollera','👗'],['Montuno','👔'],['Sombrero pintao','👒'],['Tembleques','✨']])]),
        A('Los bailes y tradiciones de Panamá','💃','Reconoce nuestras manifestaciones culturales.','Manifestaciones culturales','Identificar imágenes y relacionarlas con sus nombres',
          ['Tamborito panameño','Cumbia panameña','Diablicos Panamá máscaras','Congos Portobelo'],
          [H('Selecciona las manifestaciones culturales de Panamá (elige todas las correctas).',[
            ['Cumbia','💃',1],['Tamborito','🥁',1],['Diablicos','👹',1],['Congos','🎭',1],['Breakdance','🤸',0],['Patinaje artístico','⛸️',0]],true)]),
        A('Sabores de nuestra tierra','🫔','Comidas y bebidas tradicionales.','Comidas y bebidas tradicionales','Clasificar imágenes de alimentos',
          ['Tamales panameños','Carimañolas','Rondón Panamá','Chicheme'],
          [H('Selecciona cuáles son comidas y bebidas tradicionales de Panamá.',[
            ['Tamales','🫔',1],['Carimañolas','🥟',1],['Rondón','🍲',1],['Chicheme','🥤',1],['Arroz con pollo','🍗',1],['Sushi','🍣',0],['Hamburguesa','🍔',0]],true)]),
        A('Conocemos las artesanías panameñas','🧵','Identifica el patrimonio cultural.','Patrimonio cultural','Rompecabezas y reconocimiento visual',
          ['Molas panameñas','Sombrero pintao','Máscaras de diablicos','Cutarras Panamá'],
          [H('Identifica las artesanías tradicionales de Panamá.',[
            ['Mola','🧵',1],['Sombrero pintao','👒',1],['Máscaras de diablicos','👹',1],['Chácaras','📿',1],['Cutarras','👡',1],['Teléfono celular','📱',0],['Juguete de plástico','🧸',0]],true)]),
        A('Los símbolos de nuestra nación','🇵🇦','Bandera, escudo e himno.','Bandera, escudo e himno nacional','Arrastrar y relacionar',
          ['Bandera de Panamá','Escudo de Panamá','Himno Nacional de Panamá'],
          [C('Une cada símbolo con su nombre.',[
            ['Imagen de la bandera','🇵🇦','Bandera Nacional'],['Imagen del escudo','🛡️','Escudo Nacional'],['Notas musicales','🎼','Himno Nacional']]),
           H('¿Qué día celebramos los símbolos de la nación?',[['3 de noviembre','📅',0],['4 de noviembre','📅',1],['28 de noviembre','📅',0]])]),
        A('La gran aventura de la historia panameña','🧭','Búsqueda del tesoro con pistas.','Identidad nacional y acontecimientos históricos','Búsqueda del tesoro con pistas',
          ['Panamá Viejo','Museo del Canal Interoceánico','Historia de Panamá'],
          [H('Pista 1: En 1519 se fundó una ciudad importante. ¿Cuál fue?',[['Ciudad de Panamá','🏙️',1],['Colón','⚓',0],['David','🏞️',0]]),
           H('Pista 2: En 1821 Panamá logró independizarse de España. ¿En qué año?',[['1821','🕊️',1],['1903','🇵🇦',0],['1914','🚢',0]]),
           H('Pista 3: En 1903 Panamá se separó de otro país. ¿Cuál?',[['España','🏰',0],['Colombia','🇨🇴',1],['Costa Rica','🇨🇷',0]]),
           H('Pista 4: En 1914 se inauguró una importante vía acuática. ¿Cuál?',[['Canal de Panamá','🚢',1],['Río Chagres','🏞️',0],['Lago Gatún','🌊',0]])])
      ]
    };

    // --- 1C. MOTOR DE JUEGOS ---
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    let G = null; // estado del juego actual

    function renderActLesson(t) {
      const q = t.games[0].q;
      const hero = t.photo ? `<span class="ph big"><i>${t.emoji}</i><img src="${esc(t.photo)}" alt="${esc(t.title)}"></span>`
                           : `<span class="ph big" data-q="${esc((t.imgs || [''])[0])}"><i>${t.emoji}</i></span>`;
      app.innerHTML = `
        <button class="back-btn" data-go="temas">← Volver a las actividades</button>
        <div class="section-head" style="margin-top:0"><div>
          <span class="pill">${state.grade}° GRADO · ${state.area.toUpperCase()} · ACTIVIDAD ${state.topicIndex + 1}</span>
          <h1 class="page-title" style="margin-top:10px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6)">${esc(t.title)}</h1>
        </div></div>
        <div class="lesson-layout">
          <div class="lesson-visual hero-photo">${hero}</div>
          <article class="panel lesson-copy">
            <h2>🎮 ${esc(t.juego)}</h2>
            <p><b>Tema:</b> ${esc(t.tema)}</p>
            ${t.lesson ? `<p>${esc(t.lesson)}</p>` : ''}${(t.points||[]).length ? `<h3>⭐ Recuerda</h3><ul>${t.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${(t.reflect||[]).length ? `<h3>💬 Piensa y responde</h3><ul>${t.reflect.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}<p><b>Misión:</b> ${esc(q)}</p>
            <div class="tip">💡 Toca un elemento y luego toca su lugar. También puedes arrastrarlo. ¡Puedes intentarlo las veces que quieras!</div>
            <h3>🖼️ Mira las imágenes</h3>
            ${gallery(t)}
            <div class="button-row"><button class="btn btn-green" data-action="start-game">🚀 ¡Jugar!</button><button class="btn btn-light" data-go="temas">Ver otras actividades</button></div>
          </article>
        </div>`;
      hydrate();
    }

    function startGame() { G = { gi: 0, mistakes: 0, total: 0 }; initGame(); state.screen = 'juego'; render(); }
    function curGame() { return currentTopic().games[G.gi]; }
    function initGame() {
      const g = currentTopic().games[G.gi];
      G.sel = null; G.msg = '';
      if (g.type === 'classify') { G.placed = {}; G.total += g.items.length; G.order = shuffle(g.items.map((_, i) => i)); }
      if (g.type === 'order') { G.next = 0; G.total += g.items.length; G.order = shuffle(g.items.map((_, i) => i)); }
      if (g.type === 'memory') { G.flip = []; G.done = []; G.total += g.items.length;
        G.cards = shuffle(g.items.flatMap((it, i) => [{ k: i, kind: 'e', txt: it[1] }, { k: i, kind: 't', txt: it[0] }])); }
      if (g.type === 'choice') { G.picked = []; G.wrong = false; G.total += 1; G.order = shuffle(g.opts.map((_, i) => i)); }
      if (g.type === 'scene') { G.found = []; G.step = 0; G.total += g.spots.length; }
    }
    function nextGame() {
      G.gi++;
      if (G.gi >= currentTopic().games.length) return finishGame();
      initGame(); render(); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function mistake(m) { G.mistakes++; toast(m || 'Inténtalo de nuevo 💪'); }

    function renderGame() {
      const t = currentTopic(), g = curGame(), n = t.games.length;
      let body = '';
      if (g.type === 'classify') {
        const left = G.order.filter(i => !(i in G.placed));
        body = `<div class="g-pool">${left.map(i => `<button class="g-chip ${G.sel === i ? 'sel' : ''}" draggable="true" data-g="chip" data-i="${i}">${ph(g.items[i][0], g.items[i][1])}${esc(g.items[i][0])}</button>`).join('') || '<em>¡Todo clasificado!</em>'}</div>
          <div class="g-cats">${g.cats.map(c => `<button class="g-cat" data-g="cat" data-c="${esc(c)}"><h4>${esc(c)}</h4>${Object.keys(G.placed).filter(i => G.placed[i] === c).map(i => `<span class="g-mini">${g.items[i][1]} ${esc(g.items[i][0])}</span>`).join('')}</button>`).join('')}</div>`;
      } else if (g.type === 'order') {
        body = `<div class="g-pool">${G.order.map(i => `<button class="g-chip ${i < G.next ? 'ok' : ''}" data-g="ord" data-i="${i}" ${i < G.next ? 'disabled' : ''}>${i < G.next ? `<span class="num">${i + 1}</span>` : ph(g.items[i][0], g.items[i][1], true)}${esc(g.items[i][0])}</button>`).join('')}</div>`;
      } else if (g.type === 'memory') {
        body = `<div class="g-mem">${G.cards.map((c, idx) => { const open = G.flip.includes(idx) || G.done.includes(c.k);
          return `<button class="mem-card ${open ? 'open' : ''} ${G.done.includes(c.k) ? 'ok' : ''}" data-g="card" data-i="${idx}">${open ? (c.kind === 'e' ? ph(g.items[c.k][0], c.txt, true) : esc(c.txt)) : '❓'}</button>`; }).join('')}</div>`;
      } else if (g.type === 'choice') {
        body = `<div class="answer-list">${G.order.map(i => `<button class="answer-option ${G.picked.includes(i) ? 'selected' : ''}" data-g="opt" data-i="${i}">${ph(g.opts[i][0], g.opts[i][1])}${esc(g.opts[i][0])}</button>`).join('')}</div>
          <div class="quiz-footer"><span class="empty-note">${g.multi ? 'Puedes elegir varias respuestas.' : 'Elige una respuesta.'}</span><button class="btn btn-primary" data-g="check" ${G.picked.length ? '' : 'disabled'}>Comprobar ✔</button></div>`;
      } else if (g.type === 'scene') {
        const target = g.spots[G.step];
        body = `<p class="g-find">${target ? `👉 Encuentra: <b>${esc(target[0])}</b>` : '¡Los encontraste todos!'}</p>
          <div class="scene" style="background:${g.bg}">${g.spots.map((s, i) => `<button class="hot ${G.found.includes(i) ? 'found' : ''}" style="left:${s[2]}%;top:${s[3]}%" data-g="hot" data-i="${i}" aria-label="${esc(s[0])}">${s[1]}${G.found.includes(i) ? `<small>${esc(s[0])}</small>` : ''}</button>`).join('')}</div>`;
      }
      app.innerHTML = `
        <button class="back-btn" data-go="leccion">← Salir del juego</button>
        <section class="panel g-panel">
          <div class="pill">${t.title}${n > 1 ? ` · parte ${G.gi + 1} de ${n}` : ''}</div>
          <h2 style="color:var(--ink);margin:10px 0 14px">${esc(g.q)}</h2>
          ${body}
          <h4 style="color:var(--muted);margin:18px 0 6px">🖼️ Imágenes de la actividad</h4>${gallery(t)}
        </section>`;
      hydrate();
    }

    function gameClick(b) {
      const g = curGame(), k = b.dataset.g, i = Number(b.dataset.i);
      if (k === 'chip') { G.sel = (G.sel === i ? null : i); return renderGame(); }
      if (k === 'cat') {
        if (G.sel === null) return toast('Primero toca un elemento 👆');
        return placeItem(G.sel, b.dataset.c);
      }
      if (k === 'ord') {
        if (i === G.next) { G.next++; if (G.next === g.items.length) { toast('¡Orden correcto! 🎉'); return setTimeout(nextGame, 700); } }
        else mistake('Ese no va ahora. ¡Piensa cuál fue primero!');
        return renderGame();
      }
      if (k === 'card') {
        if (G.flip.length === 2 || G.flip.includes(i) || G.done.includes(G.cards[i].k)) return;
        G.flip.push(i); renderGame();
        if (G.flip.length === 2) setTimeout(() => {
          const [a, c] = G.flip.map(x => G.cards[x]);
          if (a.k === c.k) { G.done.push(a.k); toast('¡Pareja encontrada! ✨'); } else mistake('No son pareja. ¡Sigue buscando!');
          G.flip = [];
          if (G.done.length === g.items.length) { renderGame(); setTimeout(nextGame, 700); } else renderGame();
        }, 800);
        return;
      }
      if (k === 'opt') {
        G.picked = g.multi ? (G.picked.includes(i) ? G.picked.filter(x => x !== i) : [...G.picked, i]) : [i];
        return renderGame();
      }
      if (k === 'check') {
        const right = g.opts.map((o, x) => o[2] ? x : -1).filter(x => x >= 0);
        const ok = right.length === G.picked.length && right.every(x => G.picked.includes(x));
        if (ok) { toast(g.why || '¡Correcto! 🎉'); setTimeout(nextGame, 700); }
        else { mistake('Revisa tus respuestas e inténtalo otra vez.'); G.picked = []; renderGame(); }
        return;
      }
      if (k === 'hot') {
        if (G.found.includes(i)) return;
        if (i === G.step) { G.found.push(i); G.step++; if (G.step === g.spots.length) { renderGame(); toast('¡Los encontraste todos! 🎉'); return setTimeout(nextGame, 900); } }
        else mistake('Ese no es. ¡Sigue buscando! 🔎');
        return renderGame();
      }
    }
    function placeItem(i, c) {
      const g = curGame();
      if (g.items[i][2] === c) {
        G.placed[i] = c; G.sel = null; toast('¡Muy bien! ✅');
        if (Object.keys(G.placed).length === g.items.length) { renderGame(); return setTimeout(nextGame, 700); }
      } else mistake('Ese elemento no va ahí. ¡Intenta otra vez!');
      renderGame();
    }

    function finishGame() {
      const score = Math.max(0, G.total - G.mistakes), pct = Math.round(score / G.total * 100);
      saved.attempts++; saved.correct += score;
      const key = doneKey();
      if (!saved.completed.includes(key)) saved.completed.push(key);
      if (!saved.badges.includes('primer-paso')) saved.badges.push('primer-paso');
      if (pct >= 60 && !saved.badges.includes('mente-curiosa')) saved.badges.push('mente-curiosa');
      if (pct === 100 && !saved.badges.includes('perfecto')) saved.badges.push('perfecto');
      save();
      if (pct >= 60 && typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: .6 }, colors: ['#ffffff', '#ff3b3b', '#1e5fd9'] });
      state.lastResult = { score, total: G.total, pct };
      state.screen = 'resultado'; render();
    }


// Arrastrar y soltar (además de tocar)
document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('[data-g="chip"]'); if (c && G) { G.sel = Number(c.dataset.i); e.dataTransfer.setData('text/plain', c.dataset.i); } });
document.addEventListener('dragover', e => { if (e.target.closest && e.target.closest('[data-g="cat"]')) e.preventDefault(); });
document.addEventListener('drop', e => { const k = e.target.closest && e.target.closest('[data-g="cat"]'); if (k && G && G.sel !== null) { e.preventDefault(); placeItem(G.sel, k.dataset.c); } });
