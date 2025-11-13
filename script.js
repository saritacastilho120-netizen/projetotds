
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.data').forEach(e=>{
    const hoje=new Date();
    const opcoes={day:'numeric',month:'long',year:'numeric'};
    e.textContent=hoje.toLocaleDateString('pt-BR',opcoes);
  });
  initChart(); initQuiz(); initMemory();
});

function initChart(){
  const canvas=document.getElementById('chart'); if(!canvas) return;
  const ctx=canvas.getContext('2d'); const labels=['2020','2021','2022','2023','2024','2025']; const values=[20,35,50,75,110,145];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const padding=30, w=canvas.width-padding*2, h=canvas.height-padding*2, max=Math.max(...values);
  ctx.strokeStyle='#000'; ctx.beginPath(); ctx.moveTo(padding,padding); ctx.lineTo(padding,padding+h); ctx.lineTo(padding+w,padding+h); ctx.stroke();
  const barW = w/values.length*0.6;
  values.forEach((v,i)=>{
    const x=padding + i*(w/values.length) + (w/values.length - barW)/2;
    const barH=(v/max)*(h-10); ctx.fillStyle='#000'; ctx.fillRect(x,padding+(h-barH),barW,barH);
    ctx.fillStyle='#000'; ctx.font='12px sans-serif'; ctx.fillText(labels[i], x, padding+h+14);
  });
}

function initQuiz(){
  const questions=[
    {q:'Você recebeu um link dizendo que ganhou um prêmio por SMS.', answer:true, explain:'Sites falsos pedem dados; desconfie.'},
    {q:'O banco pediu por WhatsApp sua senha para atualizar conta.', answer:true, explain:'Banco nunca pede senha por mensagem.'},
    {q:'Um número novo pede ajuda dizendo ser seu parente e pede dinheiro.', answer:true, explain:'Confirme por outra via antes de enviar.'},
    {q:'Recebeu um aviso oficial pelo app do banco que precisa confirmar transação.', answer:false, explain:'Se for pelo app oficial, confirme dentro do próprio app.'},
    {q:'Um perfil com selo de verificação pede PIX em nome de promoção.', answer:true, explain:'Perfis podem ser falsos; verifique em canais oficiais.'},
  ];
  let index=0, score=0;
  const qEl=document.getElementById('quiz-question'), fb=document.getElementById('quiz-feedback'), sc=document.getElementById('quiz-score');
  const yes=document.getElementById('btn-yes'), no=document.getElementById('btn-no');
  function show(){ const item=questions[index]; qEl.textContent=(index+1)+'. '+item.q; fb.textContent=''; sc.textContent='Pontuação: '+score+' / '+questions.length; }
  function answer(isYes){ const correct=questions[index].answer; const item=questions[index]; const userCorrect=(isYes===true && correct===true)||(isYes===false && correct===false);
    if(userCorrect){ score++; fb.textContent='✔️ Correto — '+item.explain; } else { fb.textContent='❌ Incorreto — '+item.explain; }
    index++; if(index>=questions.length){ qEl.textContent='Fim do quiz! Você acertou '+score+' de '+questions.length+'.'; sc.textContent=''; yes.disabled=true; no.disabled=true; } else { setTimeout(show,800); }
    sc.textContent='Pontuação: '+score+' / '+questions.length;
  }
  yes.addEventListener('click',()=>answer(true)); no.addEventListener('click',()=>answer(false)); show();
}

function initMemory(){
  const board=document.getElementById('memory-board'); const status=document.getElementById('memory-status'); const reset=document.getElementById('memory-reset'); if(!board) return;
  const icons=['🔒','📱','💳','⚠️','👮','🔑','📛','💬']; const cards=shuffle(icons.concat(icons));
  board.innerHTML=''; let first=null, lock=false, matches=0;
  cards.forEach(c=>{ const el=document.createElement('div'); el.className='memory-card'; el.dataset.icon=c; el.textContent=''; el.addEventListener('click',()=>{
    if(lock || el.classList.contains('matched') || el===first) return; el.textContent=el.dataset.icon; if(!first){ first=el; return; }
    if(first.dataset.icon===el.dataset.icon){ first.classList.add('matched'); el.classList.add('matched'); matches++; status.textContent='Acertou! Dica: '+tipForIcon(el.dataset.icon); first=null; if(matches===cards.length/2){ status.textContent='Parabéns! Você completou o jogo.'; } }
    else{ lock=true; setTimeout(()=>{ first.textContent=''; el.textContent=''; first=null; lock=false; status.textContent='Tente novamente.'; },800); }
  }); board.appendChild(el); });
  reset.addEventListener('click',initMemory);
}

function tipForIcon(icon){ const map={'🔒':'Use senhas fortes e não compartilhe.','📱':'Não clique em links suspeitos no celular.','💳':'Verifique extratos frequentemente.','⚠️':'Desconfie de mensagens urgentes.','👮':'Denuncie às autoridades quando houver golpe.','🔑':'Ative a autenticação em dois fatores.','📛':'Confirme identidade antes de ajudar.','💬':'Converse com familiares antes de transferir dinheiro.'}; return map[icon]||'Mantenha-se atento.'; }

function shuffle(array){ for(let i=array.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [array[i],array[j]]=[array[j],array[i]]; } return array; }
