insert into public.site_settings(business_name,slogan,address,opening_hours,whatsapp_message,seo_title,seo_description)
select 'Axis Day Hospital','Sua cirurgia. Nossa estrutura.','Avenida Rubem Berta, 850 — Conjunto 1404 — Indianápolis — São Paulo/SP','Segunda a sexta-feira, das 07:00 às 19:00','Olá. Sou médico(a) e gostaria de conhecer as condições para realizar procedimentos no Axis Day Hospital.','Axis Day Hospital | Estrutura cirúrgica para médicos em São Paulo','Pacotes de cirurgias eletivas para médicos externos em um Day Hospital orientado por segurança, tecnologia e praticidade.'
where not exists(select 1 from public.site_settings);

insert into public.page_sections(section_key,eyebrow,title,description,cta_label,cta_url,active,sort_order,content) values
('hero','Day Hospital · São Paulo','Sua cirurgia. Nossa estrutura.','Um Day Hospital pensado para oferecer segurança, tecnologia e praticidade ao médico e aos seus pacientes.','Conheça o Axis','#o-axis',true,10,'{}'),
('positioning','Axis Day Hospital','Estrutura para quem leva cada cirurgia a sério.','O Axis disponibiliza pacotes de cirurgias eletivas para médicos externos que buscam um espaço para realizar seus procedimentos. Uma proposta orientada pelos pilares informados pela instituição.',null,null,true,20,'{}'),
('physicians','Para médicos','Você cuida da cirurgia. O Axis cuida da estrutura.','O modelo é direcionado a médicos externos interessados em trazer seu movimento de cirurgias para o Axis Day Hospital. As condições específicas são apresentadas pelo contato comercial, sem promessas ou escopos não confirmados.','Quero conhecer as condições','#contato',true,30,'{}'),
('process','Como funciona','Uma conversa clara, do primeiro contato à organização.','Etapas iniciais administráveis no CMS. O fluxo definitivo deve ser validado pela operação antes da publicação.',null,null,true,40,'{"steps":["Entre em contato","Informe sua necessidade","Receba as informações do Axis","Organize sua cirurgia"]}'),
('editorial_cta','Próximo passo','Seu próximo procedimento pode começar aqui.','Fale com o Axis para conhecer as informações comerciais e avaliar a adequação à sua necessidade.','Quero falar com o Axis','#contato',true,50,'{}')
on conflict(section_key) do nothing;

insert into public.differentials(title,description,active,sort_order) values
('Segurança','Um dos pilares que orientam o posicionamento do Axis.',true,10),
('Tecnologia','Tecnologia de ponta como princípio informado pela instituição.',true,20),
('Praticidade','Uma relação pensada para simplificar a jornada do médico.',true,30);
