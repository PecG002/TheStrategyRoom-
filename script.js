const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const header = $('.site-header');
const menuToggle = $('.menu-toggle');
const mobileMenu = $('.mobile-menu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, {passive:true});

menuToggle.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});

$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

const modal = $('#booking-modal');
const openModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); $('.modal-close').focus(); };
const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); };
$$('[data-book]').forEach(btn => btn.addEventListener('click', openModal));
$$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in-view'); });
}, {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

const frameworkData = {
  foundation: {
    number:'01', label:'FOUNDATION',
    title:'Who does what, who reports to whom, and where accountability sits.',
    description:'Foundation creates the basic operating structure of the business. It makes responsibility visible before expecting processes or performance to improve.',
    examples:['Organisational structures','Roles & responsibilities','Accountability systems','Reporting structures']
  },
  process: {
    number:'02', label:'PROCESS',
    title:'How work gets done consistently through documented workflows and SOPs.',
    description:'Process turns important work into a repeatable way of operating so results do not depend entirely on memory, improvisation or one individual.',
    examples:['SOPs','Workflows','Checklists','Operational procedures']
  },
  oversight: {
    number:'03', label:'OVERSIGHT',
    title:'How leadership knows whether the system is actually working.',
    description:'Oversight creates a practical way to monitor performance, follow up and identify where attention is needed.',
    examples:['Performance tracking','Reporting systems','Monitoring frameworks','Accountability mechanisms']
  }
};
$$('.layer').forEach(btn => btn.addEventListener('click', () => {
  $$('.layer').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
  btn.classList.add('active'); btn.setAttribute('aria-selected','true');
  const d = frameworkData[btn.dataset.layer];
  $('.framework-number').textContent = d.number;
  $('.framework-copy .eyebrow').textContent = d.label;
  $('#framework-title').textContent = d.title;
  $('#framework-description').textContent = d.description;
  $('#framework-examples').innerHTML = d.examples.map(x => `<span>${x}</span>`).join('');
}));

const systemData = {
  structure:{kicker:'01 — BUSINESS STRUCTURE',title:'Make ownership visible.',copy:'We clarify how the business is organised so people understand where responsibility begins, where it ends and how accountability flows.',solve:'Confusion around roles, duplicated work and unclear reporting.',build:'Organisational structures, roles and responsibilities, accountability and reporting structures.',matter:'Work moves faster when ownership is clear.',after:'People know what they own, who they report to and where decisions sit.'},
  operations:{kicker:'02 — OPERATIONAL SYSTEMS',title:'Make important work repeatable.',copy:'We translate recurring work into practical processes that can be followed, understood and improved.',solve:'Inconsistent execution, forgotten steps and knowledge trapped in people’s heads.',build:'SOPs, workflows, checklists and operational procedures.',matter:'Consistency should not depend on memory or mood.',after:'Core work follows a clearer sequence and is easier to hand over.'},
  management:{kicker:'03 — MANAGEMENT SYSTEMS',title:'Make performance easier to see.',copy:'We create mechanisms that help leadership follow what is happening without relying on constant informal updates.',solve:'Limited visibility, weak follow-up and unclear accountability.',build:'Performance tracking, reporting systems, monitoring frameworks and accountability mechanisms.',matter:'Management needs information, not guesswork.',after:'Leadership has a clearer view of ownership, progress and areas needing attention.'},
  growth:{kicker:'04 — GROWTH SYSTEMS',title:'Prepare the business to carry more.',copy:'We strengthen the structures that help a business absorb growth without forcing the founder to become the permanent operating system.',solve:'Growth that increases founder pressure and operational chaos.',build:'Scalable processes, delegation structures and business continuity systems.',matter:'A growing business needs capacity beyond one person.',after:'The business has a stronger base for delegation and more consistent operations.'}
};
$$('.system-option').forEach(btn => btn.addEventListener('click', () => {
  $$('.system-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = systemData[btn.dataset.system];
  $('#system-kicker').textContent=d.kicker; $('#system-title').textContent=d.title; $('#system-copy').textContent=d.copy;
  $('#solve').textContent=d.solve; $('#build').textContent=d.build; $('#matter').textContent=d.matter; $('#after').textContent=d.after;
}));

const timeline = $('#timeline');
const steps = $$('.process-step');
const updateTimeline = () => {
  if(!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const viewportPoint = window.innerHeight * .58;
  let activeIndex = 0;
  steps.forEach((step,i) => { if(step.getBoundingClientRect().top < viewportPoint) activeIndex = i; });
  steps.forEach((s,i) => s.classList.toggle('active', i === activeIndex));
  const progress = Math.max(0, Math.min(100, ((viewportPoint - rect.top) / rect.height) * 100));
  $('.timeline-progress').style.height = progress + '%';
};
window.addEventListener('scroll', updateTimeline, {passive:true});
updateTimeline();

const questions = [
  'Could your team complete their core tasks if you disappeared for two weeks?',
  'Are responsibilities for critical business functions clearly defined?',
  'Do your key processes exist outside people’s heads?',
  'Can you easily tell what is working and what is not?',
  'Do you know exactly who owns each critical business function?'
];
let qIndex=0, score=0;
const renderQuestion = () => {
  $('#question').textContent = questions[qIndex];
  $('.question-number').textContent = String(qIndex+1).padStart(2,'0');
  $('#diagnostic-count').textContent = `QUESTION ${qIndex+1} OF ${questions.length}`;
  $('#diagnostic-progress').style.width = `${((qIndex+1)/questions.length)*100}%`;
};
$$('.answer-buttons button').forEach(btn => btn.addEventListener('click', e => {
  score += Number(e.currentTarget.dataset.score);
  qIndex++;
  if(qIndex < questions.length) renderQuestion();
  else showResult();
}));
function showResult(){
  $('#quiz-content').classList.add('hidden');
  $('#quiz-result').classList.remove('hidden');
  let title, copy;
  if(score <= 3){ title='SYSTEM DEPENDENT'; copy='Your answers suggest that the business may rely heavily on individual people and informal ways of working. The first opportunity is to make ownership and critical processes more visible.'; }
  else if(score <= 7){ title='SYSTEM DEVELOPING'; copy='Some structure is already present, but there may still be important gaps between how work should happen and how it actually happens. Strengthening the foundations can reduce inconsistency and dependence.'; }
  else { title='SYSTEM READY'; copy='Your answers suggest a stronger operating base. The next opportunity may be to strengthen oversight, consistency and the systems needed to support future growth.'; }
  $('#result-title').textContent=title; $('#result-copy').textContent=copy; $('#diagnostic-count').textContent='DIAGNOSTIC COMPLETE'; $('#diagnostic-progress').style.width='100%';
}
$('#restart-quiz').addEventListener('click', () => {
  qIndex=0;score=0;$('#quiz-result').classList.add('hidden');$('#quiz-content').classList.remove('hidden');renderQuestion();
});
$('#year').textContent = new Date().getFullYear();
renderQuestion();