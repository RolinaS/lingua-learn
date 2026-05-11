import { PrismaClient, LanguageCode } from '@prisma/client'

const prisma = new PrismaClient()

// Phonétiques indexées par terme EN : [es, ar, ru]
const P: Record<string, [string, string, string]> = {
  // SALUTATIONS
  'Hello':            ['/ˈo.la/',            '/mar.ˈħa.ba/',           '/prʲɪˈvʲet/'],
  'Good morning':     ['/ˈbwe.nos ˈdi.as/',  '/ˈsˤa.baħ al.ˈxajr/',   '/ˈdo.brəjɪ ˈu.trə/'],
  'Good evening':     ['/ˈbwe.nas ˈno.tʃes/','/ma.ˈsaː al.ˈxajr/',    '/ˈdo.bryj ˈvʲe.tʃɪr/'],
  'Good night':       ['/ˈbwe.nas ˈno.tʃes/','/tˤa.ˈsˤabaħ xajr/',    '/spɐˈkoj.nəj ˈno.tʃɪ/'],
  'Goodbye':          ['/a.ˈðjos/',           '/wa.ˈda.ʕan/',           '/də svɪˈda.nʲɪjə/'],
  'See you later':    ['/ˈas.ta ˈlwe.ɣo/',   '/ˈi.la al.li.qaːʔ/',    '/da ˈsko.rəvə/'],
  'Thank you':        ['/ˈɡra.sjas/',         '/ˈʃuk.ran/',             '/spɐˈsi.bə/'],
  'Please':           ['/por fa.ˈβor/',       '/min ˈfad.lak/',         '/pə.ˈʒa.lʊj.stə/'],
  'Sorry':            ['/lo ˈsjɛn.to/',       '/ˈʔa.sif/',              '/ɪz.vʲɪˈnʲi.tʲe/'],
  'Excuse me':        ['/dis.ˈkul.pe/',       '/ˈʕaf.wan/',             '/prɐˈstʲi.tʲe/'],
  'You\'re welcome':  ['/de ˈna.ða/',         '/ˈʕaf.wan/',             '/pə.ˈʒa.lʊj.stə/'],
  'How are you?':     ['/ˈko.mo es.ˈtas/',    '/kajf ħa.ˈlak/',        '/kak dʲe.ˈla/'],
  'I\'m fine':        ['/es.ˈtoj ˈbjɛn/',     '/ˈa.na bi.ˈxajr/',      '/ja f pɐˈrjat.kʲe/'],
  'Nice to meet you': ['/en.kan.ˈta.ðo/',     '/jəsˈʕad.ni liˈqaːʔuk/','/ˈprʲi.jət.nə pəz.nɐˈko.mʲɪt.sə/'],
  'My name is':       ['/me ˈja.mo/',         '/ˈis.mi/',               '/mɪˈnja zoˈvut/'],
  'Welcome':          ['/bjɛn.ve.ˈni.ðo/',    '/ˈʔah.lan wa.ˈsah.lan/','/dobr pəˈʒa.lɐ.vat/'],
  'Happy birthday':   ['/fe.ˈlis kum.pleˈaɲos/','/ˈʕid miˈlad saˈʕid/', '/s dʲnʲom rɐˈʒdʲe.nʲɪjə/'],
  'Congratulations':  ['/fe.li.si.taˈsjo.nes/','/mabˈruːk/',            '/pəz.drɐˈvlja.ju/'],
  'Yes':              ['/si/',                '/naˈʕam/',               '/da/'],
  'No':               ['/no/',               '/laː/',                  '/nʲet/'],
  'Maybe':            ['/ˈki.sas/',           '/ˈrub.bəˌma/',           '/ˈmo.ʒɪt ˈbɨt/'],
  'Of course':        ['/por su.ˈpwes.to/',   '/bɪtˈtˤabiː/',          '/kɐˈnʲeʃ.nə/'],
  'I don\'t know':    ['/no lo ˈse/',         '/laː ˈʔaʕ.lam/',        '/ja nʲe ˈzna.ju/'],
  'I understand':     ['/en.ˈtjen.do/',       '/ˈʔaf.ham/',             '/ja pɐˈnʲi.ma.ju/'],
  // FAMILLE
  'Mother':           ['/ˈma.ðre/',           '/ˈʔum/',                 '/matʲ/'],
  'Father':           ['/ˈpa.ðre/',           '/ˈʔab/',                 '/ɐˈtʲets/'],
  'Brother':          ['/er.ˈma.no/',         '/ˈʔax/',                 '/brat/'],
  'Sister':           ['/er.ˈma.na/',         '/ˈʔuxt/',                '/sʲɪsˈtra/'],
  'Grandmother':      ['/aˈbwe.la/',          '/ˈdʒad.da/',             '/ˈba.buʃ.ka/'],
  'Grandfather':      ['/aˈbwe.lo/',          '/ˈdʒadd/',               '/ˈdʲe.duʃ.ka/'],
  'Son':              ['/ˈi.xo/',             '/ˈibn/',                 '/sɨn/'],
  'Daughter':         ['/ˈi.xa/',             '/ˈibna/',                '/dotʃ/'],
  'Uncle':            ['/ˈtjo/',              '/ˈʕamm/',                '/ˈdja.dʲa/'],
  'Aunt':             ['/ˈtja/',              '/ˈʕam.ma/',              '/ˈtʲo.tʲa/'],
  'Cousin':           ['/ˈpri.mo/',           '/ˈibn ˈʕamm/',          '/dvʊˈrɔd.nɨj brat/'],
  'Husband':          ['/maˈri.ðo/',          '/zawdʒ/',                '/muʃ/'],
  'Wife':             ['/esˈpo.sa/',          '/ˈzaw.dʒa/',             '/ʐɨˈna/'],
  'Baby':             ['/beˈbe/',             '/tˤifl raˈdˤiːʕ/',       '/mɐˈlɨʃ/'],
  'Child':            ['/ˈni.ɲo/',           '/tˤifl/',                '/rʲɪˈbjɔ.nək/'],
  'Parents':          ['/ˈpa.ðres/',          '/ˈwa.li.dan/',           '/rɐdʲɪˈtʲe.lʲɪ/'],
  'Family':           ['/faˈmi.lja/',         '/ˈʕa.ʔi.la/',            '/sʲɪˈmʲja/'],
  'Nephew':           ['/soˈbri.no/',         '/ˈibn al.ˈʔax/',        '/plʲɪˈmjan.nʲɪk/'],
  'Niece':            ['/soˈbri.na/',         '/ˈbint al.ˈʔax/',       '/plʲɪˈmjan.nʲɪ.tsə/'],
  'Twins':            ['/ˈxe.me.los/',        '/tawˈʔam/',              '/blʲɪzˈnʲe.tsɨ/'],
  // NOURRITURE
  'Bread':            ['/pan/',              '/xubz/',                 '/xlʲep/'],
  'Rice':             ['/ˈa.roz/',           '/ˈʔu.ruzz/',             '/rʲis/'],
  'Meat':             ['/ˈkar.ne/',          '/laħm/',                 '/mjaˈso/'],
  'Chicken':          ['/ˈpo.ʎo/',          '/daˈdʒaːdʒ/',            '/kuˈrʲi.tsə/'],
  'Fish':             ['/pesˈka.ðo/',        '/saˈmak/',               '/rɨˈba/'],
  'Egg':              ['/ˈwe.βo/',           '/bajˈdˤa/',              '/ˈja.jtsə/'],
  'Cheese':           ['/ˈke.so/',           '/dʒubn/',                '/sɨr/'],
  'Butter':           ['/man.teˈki.ʎa/',    '/zubˈda/',               '/ˈmas.lə/'],
  'Apple':            ['/manˈza.na/',        '/tufˈfaːħa/',            '/ˈjab.lə.kə/'],
  'Banana':           ['/plaˈta.no/',        '/mawˈza/',               '/bɐˈnan/'],
  'Orange':           ['/naˈran.xa/',        '/bur.tuˈqa.la/',         '/ɐpʲɪlˈsʲin/'],
  'Tomato':           ['/toˈma.te/',         '/tˤaˈma.tˤim/',          '/pɐmʲɪˈdɔr/'],
  'Potato':           ['/paˈta.ta/',         '/ba.tˤaˈtˤa/',           '/karˈtɔ.fʲɪlʲ/'],
  'Onion':            ['/seˈbo.ʎa/',        '/bɐˈsˤal/',              '/luk/'],
  'Garlic':           ['/ˈa.xo/',            '/θawm/',                 '/tʃɪsˈnok/'],
  'Salt':             ['/sal/',             '/milħ/',                 '/solʲ/'],
  'Sugar':            ['/aˈsu.kar/',         '/sukˈkar/',              '/ˈsa.xar/'],
  'Soup':             ['/ˈso.pa/',           '/ħaˈsaːʔ/',              '/sup/'],
  'Salad':            ['/ensaˈla.ða/',       '/saˈla.tˤa/',            '/sɐˈlat/'],
  'Pasta':            ['/ˈpas.ta/',          '/maˈka.ru.na/',          '/ˈpas.ta/'],
  'Pizza':            ['/ˈpit.sa/',          '/ˈbit.za/',              '/ˈpʲit.tsə/'],
  'Cake':             ['/ˈpas.tel/',         '/ˈkakˈa/',               '/tort/'],
  'Chocolate':        ['/tʃo.koˈla.te/',    '/ʃu.kuˈla.ta/',          '/ʃɐkɐˈlat/'],
  'Ice cream':        ['/eˈla.ðo/',          '/ˈajs ˈkriːm/',          '/mɐrɐˈʒe.nəje/'],
  'Sandwich':         ['/ˈsant.witʃ/',       '/ˈsand.witʃ/',           '/buterˈbrod/'],
  'Mushroom':         ['/tʃampiˈɲon/',       '/fˤitr/',                '/ɡrʲip/'],
  'Strawberry':       ['/ˈfre.sa/',          '/faˈra.wi.la/',          '/klubˈnʲi.kə/'],
  'Lemon':            ['/liˈmon/',           '/lajˈmuːn/',             '/lʲɪˈmon/'],
  'Honey':            ['/ˈmjel/',            '/ˈʕa.sal/',              '/mʲot/'],
  // BOISSONS
  'Water':            ['/ˈa.ɣwa/',           '/maːʔ/',                 '/vɐˈda/'],
  'Coffee':           ['/ˈka.fe/',           '/ˈqah.wa/',              '/ˈko.fʲe/'],
  'Tea':              ['/te/',              '/ʃaːj/',                 '/tʃaj/'],
  'Milk':             ['/ˈle.tʃe/',         '/ħaˈliːb/',              '/mɐˈlo.kə/'],
  'Juice':            ['/ˈxu.ɣo/',          '/ˈʕa.sˤiːr/',            '/sok/'],
  'Beer':             ['/serˈβe.sa/',        '/bɪˈra/',                '/pʲɪˈvo/'],
  'Wine':             ['/ˈbi.no/',           '/naˈbiːð/',              '/vʲɪˈno/'],
  // MAISON
  'House':            ['/ˈka.sa/',           '/ˈman.zil/',             '/dom/'],
  'Kitchen':          ['/koˈsi.na/',         '/ˈmatˤ.bax/',            '/ˈkux.nʲə/'],
  'Bedroom':          ['/dormiˈto.rjo/',     '/ɣurfa nawm/',          '/spalˈnʲa/'],
  'Bathroom':         ['/ˈkwarto de ˈbaɲo/', '/ħamˈmaːm/',            '/ˈvan.nə.jə/'],
  'Living room':      ['/ˈsala de esˈtar/',  '/ɣurfa almaˈʕiːʃa/',    '/ɡɐsˈtʲi.nə.jə/'],
  'Door':             ['/ˈpwer.ta/',         '/baːb/',                 '/dvʲerʲ/'],
  'Window':           ['/benˈta.na/',        '/naːfiˈða/',             '/ɐkˈno/'],
  'Table':            ['/ˈme.sa/',           '/tˤaːwiˈla/',            '/stol/'],
  'Chair':            ['/ˈsi.ʎa/',          '/kurˈsiː/',              '/stul/'],
  'Bed':              ['/ˈka.ma/',           '/saˈriːr/',              '/krɐˈvatʲ/'],
  'Sofa':             ['/ˈso.fa/',           '/ˈʔa.ri.ka/',            '/dʲɪˈvan/'],
  'Fridge':           ['/neˈβe.ra/',         '/θalˈlaːdʒa/',           '/xɐlɐˈdʲilʲnʲɪk/'],
  // CORPS
  'Head':             ['/kaˈbe.sa/',         '/raːs/',                 '/ɡɐˈlo.və/'],
  'Hair':             ['/kaˈβe.ʎo/',        '/ʃaˈʕar/',              '/vɐˈlo.sɨ/'],
  'Eye':              ['/ˈo.xo/',            '/ˈʕajn/',               '/ɡlas/'],
  'Ear':              ['/oˈre.xa/',          '/ˈʔu.ðun/',             '/uˈxo/'],
  'Nose':             ['/naˈris/',           '/ˈʔanf/',               '/nos/'],
  'Mouth':            ['/ˈbo.ka/',           '/fam/',                  '/rot/'],
  'Teeth':            ['/ˈðjen.tes/',       '/ˈʔas.naːn/',            '/zuˈbɨ/'],
  'Hand':             ['/ˈma.no/',           '/jad/',                  '/ruˈka/'],
  'Finger':           ['/ˈde.ðo/',           '/ˈʔisˤbaˈʕ/',            '/ˈpalʲ.ʌts/'],
  'Foot':             ['/ˈpje/',             '/qaˈdam/',               '/stɐˈpa/'],
  'Leg':              ['/ˈpjer.na/',         '/saːq/',                 '/nɐˈɡa/'],
  'Arm':              ['/ˈbra.so/',          '/ðiˈraːʕ/',             '/ruˈka/'],
  'Heart':            ['/koraˈson/',         '/qalb/',                 '/sʲertsə/'],
  'Brain':            ['/seˈre.bro/',        '/diˈmaːɣ/',              '/mozk/'],
  // VÊTEMENTS
  'Shirt':            ['/kaˈmi.sa/',         '/qaˈmiːsˤ/',             '/ruˈbaʃ.kə/'],
  'T-shirt':          ['/ˈti.ʃert/',         '/tiːˈʃeːrt/',            '/fuˈbol.kə/'],
  'Trousers':         ['/pan.taˈlo.nes/',    '/ban.tˤaˈloːn/',         '/brjuˈkʲɪ/'],
  'Jeans':            ['/ˈva.ke.ros/',       '/dʒinz/',                '/dʒɪnˈsɨ/'],
  'Dress':            ['/besˈti.ðo/',        '/fusˈtaːn/',             '/ˈplatʲ.jə/'],
  'Jacket':           ['/tʃaˈke.ta/',        '/dʒaːˈket/',             '/kurˈtka/'],
  'Coat':             ['/aˈbri.ɣo/',         '/miˈʕtˤaf/',             '/palʲˈto/'],
  'Shoes':            ['/saˈpa.tos/',        '/ħiˈðaːʔ/',              '/ɐˈbuv/'],
  'Socks':            ['/kal.seˈti.nes/',   '/dʒaˈwa.rib/',           '/nɐˈskʲɪ/'],
  'Hat':              ['/somˈbre.ro/',       '/qubˈbaˈʕa/',            '/ʃljaˈpa/'],
  'Scarf':            ['/buˈfan.da/',        '/wiˈʃaːħ/',              '/ʃarf/'],
  // TRANSPORTS
  'Car':              ['/ˈko.tʃe/',          '/sajˈja.ra/',            '/mɐˈʃɨ.nə/'],
  'Bus':              ['/au.toˈbus/',        '/ħaˈfi.la/',             '/ɐfˈtɔ.bus/'],
  'Train':            ['/tren/',            '/qiˈtˤaːr/',             '/ˈpo.jest/'],
  'Aeroplane':        ['/aˈbjon/',           '/tˤaːˈʔi.ra/',           '/sɐmɐˈljɔt/'],
  'Bicycle':          ['/bi.siˈkle.ta/',     '/darˈra.dʒa/',           '/vʲɪlɐsɪˈpʲet/'],
  'Taxi':             ['/ˈtak.si/',          '/ˈtak.si/',              '/tɐkˈsʲi/'],
  'Boat':             ['/ˈbar.ko/',          '/qaˈriːb/',              '/ˈlot.kə/'],
  'Subway':           ['/ˈme.tro/',          '/ˈmet.ro/',              '/mʲɪˈtro/'],
  'Airport':          ['/a.e.roˈpwer.to/',   '/maˈtˤaːr/',             '/ɐ.e.rɐˈport/'],
  'Ticket':           ['/biˈʎe.te/',         '/taθˈka.ra/',            '/bʲɪˈlʲet/'],
  // MÉTÉO
  'Sun':              ['/sol/',             '/ʃams/',                 '/ˈsol.ntse/'],
  'Rain':             ['/ʎuˈβja/',           '/mɐtˤar/',               '/doʒtʲ/'],
  'Snow':             ['/ˈnje.βe/',          '/θalɡ/',                 '/sʲnʲek/'],
  'Wind':             ['/ˈbjen.to/',         '/rɪˈjaːħ/',              '/vʲe.tər/'],
  'Cloud':            ['/ˈnu.be/',           '/saˈħaːba/',             '/ɐbˈla.kə/'],
  'Storm':            ['/torˈmen.ta/',       '/ˈʕaːsˤi.fa/',           '/ˈbu.rʲa/'],
  'Hot':              ['/kaˈljen.te/',       '/ħaːr/',                 '/ˈʒar.kə/'],
  'Cold':             ['/ˈfri.o/',           '/ˈba.rid/',              '/ˈxo.lət.nə/'],
  'Rainbow':          ['/arkoˈi.ris/',       '/qaws qaˈzaħ/',          '/rɐˈdu.ɡə/'],
  'Spring':           ['/primaˈβe.ra/',      '/raˈbiːʕ/',              '/vɪsˈna/'],
  'Summer':           ['/beˈra.no/',         '/sˤajf/',                /ˈlʲe.tə/.toString()],
  'Autumn':           ['/oˈto.ɲo/',          '/xaˈriːf/',              '/ɐˈsʲenʲ/'],
  'Winter':           ['/inˈbjer.no/',       '/ʃiˈtaːʔ/',              '/zɪˈma/'],
  // COULEURS
  'Red':              ['/ˈro.xo/',           '/ˈʔaħ.mar/',             '/ˈkras.nɨj/'],
  'Blue':             ['/aˈsul/',            '/ˈʔaz.raq/',             '/ˈsʲi.nʲɪj/'],
  'Green':            ['/ˈber.de/',          '/ˈʔax.ðar/',             '/zʲɪˈlʲɔ.nɨj/'],
  'Yellow':           ['/amaˈri.ʎo/',       '/ˈʔasˤ.far/',            '/ˈʒɔl.tɨj/'],
  'Black':            ['/ˈne.ɣro/',          '/ˈʔas.wad/',             '/tʃɔrˈnɨj/'],
  'White':            ['/ˈblan.ko/',         '/ˈʔab.jadˤ/',            '/bʲeˈlɨj/'],
  'Orange (colour)':  ['/naˈran.xa/',        '/bur.tuˈqa.liː/',        '/ɐrɐnˈʒe.vɨj/'],
  'Purple':           ['/moˈra.ðo/',         '/ban.afˈsa.dʒiː/',       '/fʲɪlɐˈto.vɨj/'],
  'Pink':             ['/ˈro.sa/',           '/warˈdiː/',               '/rɐˈzo.vɨj/'],
  'Brown':            ['/maˈron/',           '/bunˈniː/',               '/kɐrʲɪtʃˈne.vɨj/'],
  'Grey':             ['/ˈɡris/',            '/raˈma.diː/',             '/sʲeˈrɨj/'],
  // CHIFFRES
  'Zero':             ['/ˈse.ro/',           '/sˤifr/',                '/nolʲ/'],
  'One':              ['/ˈu.no/',            '/ˈwaːħid/',              '/ɐˈdʲin/'],
  'Two':              ['/ˈdos/',             '/ˈiθ.naːn/',             '/dva/'],
  'Three':            ['/ˈtres/',            '/θaˈlaːθa/',             '/trʲi/'],
  'Four':             ['/ˈkwa.tro/',         '/ˈʔar.baˈʕa/',           '/tʃɪˈtɨ.rʲe/'],
  'Five':             ['/ˈsin.ko/',          '/ˈxam.sa/',              '/pʲatʲ/'],
  'Six':              ['/ˈsejs/',            '/ˈsit.ta/',              '/ʃestʲ/'],
  'Seven':            ['/ˈsje.te/',          '/ˈsab.ʕa/',              '/sʲemʲ/'],
  'Eight':            ['/ˈo.tʃo/',          '/ˈθa.maːni.ja/',         '/ˈvosʲɪmʲ/'],
  'Nine':             ['/ˈnwe.βe/',          '/ˈtis.ʕa/',              '/dʲevʲatʲ/'],
  'Ten':              ['/ˈðjes/',            '/ˈʕa.ʃa.ra/',            '/ˈdʲesʲɪtʲ/'],
  // JOURS & MOIS
  'Monday':           ['/ˈlu.nes/',          '/alˈiθ.najn/',           '/pɐnʲɪˈdʲelʲnʲɪk/'],
  'Tuesday':          ['/ˈmar.tes/',         '/alθuˈlaːθaːʔ/',         '/ˈvtor.nʲɪk/'],
  'Wednesday':        ['/ˈmjer.ko.les/',     '/alˈʔar.biˈʕaːʔ/',       '/sreˈda/'],
  'Thursday':         ['/ˈxwe.βes/',         '/alˈxaːmis/',            '/tʃɪˈtverk/'],
  'Friday':           ['/ˈbjɛr.nes/',        '/aldʒumˈʕa/',            '/ˈpʲat.nʲɪ.tsə/'],
  'Saturday':         ['/ˈsa.ba.ðo/',        '/alˈsabt/',              '/suˈbo.tə/'],
  'Sunday':           ['/ˈdo.miŋ.go/',       '/alˈʔa.ħad/',            '/vɐskrɪˈsʲenʲ.jɪ/'],
  'Today':            ['/ˈoj/',              '/alˈjawm/',              '/sɪˈvod.nʲə/'],
  'Tomorrow':         ['/maˈɲa.na/',         '/ɣaˈdan/',               '/ˈzaf.trə/'],
  'Yesterday':        ['/ˈa.jer/',           '/ˈʔams/',                '/ftʃɪˈra/'],
  'Morning':          ['/maˈɲa.na/',         '/sˤaˈbaːħ/',             '/ˈu.trə/'],
  'Evening':          ['/ˈtar.de/',          '/maˈsaːʔ/',              '/ˈvʲe.tʃɪr/'],
  'Night':            ['/ˈno.tʃe/',          '/lajl/',                 '/notʃʲ/'],
  'Week':             ['/seˈma.na/',         '/ˈʔus.buːʕ/',            '/nʲɪˈdʲe.lʲə/'],
  'Year':             ['/ˈa.ɲo/',            '/saˈna/',                '/ɡot/'],
  // SANTÉ
  'Doctor':           ['/ˈme.ði.ko/',        '/tˤaˈbiːb/',             '/vrʌtʃ/'],
  'Medicine':         ['/me.dikaˈmen.to/',   '/daˈwaːʔ/',              '/lʲɪˈkar.stvə/'],
  'Pain':             ['/doˈlor/',           '/ˈʔa.lam/',              '/bolʲ/'],
  'Fever':            ['/ˈfjɛ.bre/',         '/humˈma/',               '/lɪxɐˈrat.kə/'],
  'Healthy':          ['/saluˈda.ble/',      '/sˤaħiː/',               '/zdɐˈro.vɨj/'],
  'Ill':              ['/enˈfer.mo/',        '/maˈriːdˤ/',             '/balʲˈnoj/'],
  'Emergency':        ['/emerˈxen.sja/',     '/tˤaˈwa.riʔ/',           '/ˈsko.rə.jə/'],
  // ÉMOTIONS
  'Happy':            ['/feˈlis/',           '/saˈʕiːd/',              '/ˈstʃas.lʲɪ.vɨj/'],
  'Sad':              ['/ˈtris.te/',         '/ħaˈziːn/',              '/ˈɡrus.nɨj/'],
  'Angry':            ['/enfaˈda.ðo/',       '/ɣaˈdˤib/',              '/zloj/'],
  'Scared':           ['/asus.ˈta.ðo/',      '/xaːˈʔif/',              '/nɐˈpu.ɡan.nɨj/'],
  'Excited':          ['/e.mosjoˈna.ðo/',    '/mutˈħa.mis/',           '/vzvalˈno.van.nɨj/'],
  'Tired':            ['/kanˈsa.ðo/',        '/muˈtaˈʕab/',            '/usˈta.lɨj/'],
  'Love':             ['/aˈmor/',            '/ħubb/',                 '/ljuˈbovʲ/'],
  'Fear':             ['/ˈmje.ðo/',          '/xawf/',                 '/strax/'],
  'Joy':              ['/aleˈɡri.a/',        '/faˈraħ/',               '/ˈra.dɐstʲ/'],
  'Calm':             ['/kalˈma.ðo/',        '/haːˈdiːʔ/',             '/spɐˈkoj.nɨj/'],
  // NATURE
  'Tree':             ['/ˈar.βol/',          '/ʃaˈdʒa.ra/',            '/dʲeˈre.və/'],
  'Flower':           ['/ˈflor/',            '/zahˈra/',               '/tsveˈtok/'],
  'River':            ['/ˈri.o/',            '/nahr/',                 '/rʲeˈka/'],
  'Mountain':         ['/monˈta.ɲa/',        '/dʒaˈbal/',              '/ɡɐˈra/'],
  'Sea':              ['/mar/',             '/baħr/',                 '/mɔˈrʲe/'],
  'Forest':           ['/ˈbos.ke/',          '/ɣaˈba/',                '/lʲes/'],
  'Beach':            ['/ˈpla.xa/',          '/ʃaːtˤiʔ/',              '/ˈplʲaʃ/'],
  'Lake':             ['/ˈla.ɣo/',           '/buˈħaj.ra/',            '/ɐˈze.rə/'],
  'Sky':              ['/ˈsje.lo/',          '/saˈmaːʔ/',              '/ˈnʲe.bə/'],
  'Moon':             ['/ˈlu.na/',           '/qamar/',                /luˈna/.toString()],
  'Star':             ['/esˈtre.ʎa/',        '/nadʒm/',                '/zvʲezˈda/'],
  'Ocean':            ['/oˈse.a.no/',        '/muˈħiːtˤ/',             '/ɐkʲɪˈan/'],
  // VILLE
  'Hospital':         ['/ospiˈtal/',         '/mus.taʃˈfa/',           '/balʲˈnʲi.tsə/'],
  'Restaurant':       ['/res.tauˈrant/',     '/matˤˈʕam/',             '/rʲɪstɐˈran/'],
  'Shop':             ['/ˈtjen.da/',         '/maˈħal/',               '/mɐɡɐˈzʲin/'],
  'Bank':             ['/ˈban.ko/',          '/bank/',                 '/bank/'],
  'Hotel':            ['/oˈtel/',            '/funˈduq/',              '/ɐˈtʲelʲ/'],
  'Museum':           ['/muˈse.o/',          '/matˈħaf/',              '/muˈzʲej/'],
  'Market':           ['/merˈka.ðo/',        '/suːq/',                 '/ˈrɨ.nək/'],
  'Map':              ['/ˈma.pa/',           '/xaˈriː.tˤa/',           '/ˈkar.tə/'],
  // TRAVAIL
  'Job':              ['/traˈba.xo/',        '/waˈziː.fa/',            '/rɐˈbo.tə/'],
  'Office':           ['/oˈfi.si.na/',       '/makˈtab/',              '/ˈo.fʲɪs/'],
  'Meeting':          ['/reuˈnjon/',         '/idʒtiˈmaːʕ/',           '/fsˈtrʲe.tʃə/'],
  'Salary':           ['/saˈla.rjo/',        '/raˈtib/',               '/ˈzar.plɐ.tə/'],
  'Boss':             ['/ˈxe.fe/',           '/raˈʔiːs/',              '/nɐˈtʃalʲnʲɪk/'],
  'Computer':         ['/or.denaˈðor/',      '/ħaˈsuːb/',              '/kɐmpʲˈju.tər/'],
  'Team':             ['/eˈki.po/',          '/faˈriːq/',              '/kɐˈman.də/'],
  // ÉCOLE
  'School':           ['/esˈkwe.la/',        '/madˈra.sa/',            '/ʃkoˈla/'],
  'Teacher':          ['/profeˈsor/',        '/muˈʕal.lim/',           '/utʃɪˈtʲelʲ/'],
  'Book':             ['/ˈli.bro/',          '/kiˈtaːb/',              '/knʲiˈɡa/'],
  'Pencil':           ['/ˈla.piθ/',          '/qa.lam raˈsˤaːs/',      '/karanˈdaʃ/'],
  'Exam':             ['/exˈa.men/',         '/im.tiˈħaːn/',           '/ekˈza.mʲɪn/'],
  'Library':          ['/bib.lioˈte.ka/',    '/mak.taˈba/',            '/bʲɪblʲɪɐˈtʲe.kə/'],
  'University':       ['/u.ni.βersiˈðad/',   '/dʒaːmiˈʕa/',            '/u.nʲɪvʲɪrsʲɪˈtʲet/'],
}

async function main() {
  console.log('🔤 Ajout des phonétiques ES, AR, RU...')
  let updated = 0
  let notFound = 0

  for (const [termEn, [phoneticEs, phoneticAr, phoneticRu]] of Object.entries(P)) {

    // ES
    const wordEs = await prisma.word.findFirst({
      where: { languageCode: LanguageCode.ES, translationEn: termEn },
    })
    if (wordEs) {
      await prisma.word.update({ where: { id: wordEs.id }, data: { phonetic: phoneticEs } })
      updated++
    } else notFound++

    // AR
    const wordAr = await prisma.word.findFirst({
      where: { languageCode: LanguageCode.AR, translationEn: termEn },
    })
    if (wordAr) {
      await prisma.word.update({ where: { id: wordAr.id }, data: { phonetic: phoneticAr } })
      updated++
    } else notFound++

    // RU
    const wordRu = await prisma.word.findFirst({
      where: { languageCode: LanguageCode.RU, translationEn: termEn },
    })
    if (wordRu) {
      await prisma.word.update({ where: { id: wordRu.id }, data: { phonetic: phoneticRu } })
      updated++
    } else notFound++
  }

  console.log(`✅ ${updated} phonétiques ajoutées`)
  if (notFound > 0) console.log(`⚠️  ${notFound} mots non trouvés`)
}

main()
  .catch((e) => { console.error('❌ Erreur :', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })