insert into public.site_settings(business_name,slogan,address,opening_hours,whatsapp_message,seo_title,seo_description)
select 'Axis Day Hospital','Sua cirurgia. Nossa estrutura.','Avenida Rubem Berta, 850 — Conjunto 1404 — Indianápolis — São Paulo/SP','Segunda a sexta-feira, das 07:00 às 19:00','Olá. Sou médico(a) e gostaria de conhecer as condições para realizar procedimentos no Axis Day Hospital.','Axis Day Hospital | Estrutura moderna para médicos em São Paulo','Hospital para procedimentos invasivos de curta permanência em São Paulo, com estrutura moderna para pacientes, médicos e equipes.'
where not exists(select 1 from public.site_settings);

insert into public.page_sections(section_key,eyebrow,title,description,cta_label,cta_url,active,sort_order,content) values
('hero','Day Hospital · São Paulo','Sua cirurgia. Nossa estrutura.','Um Day Hospital pensado para oferecer segurança, tecnologia e praticidade ao médico e aos seus pacientes.','Conheça o Axis','#o-axis',true,10,'{}'),
('positioning','Axis Day Hospital','Estrutura para quem leva cada cirurgia a sério.','Um hospital especializado em procedimentos invasivos de curta permanência, que une segurança, tecnologia, excelência assistencial e atendimento humanizado, proporcionando uma experiência diferenciada ao paciente e à equipe médica.',null,null,true,20,'{}'),
('experience','Experiência Axis','Cuidado para quem realiza e para quem recebe cada procedimento.','Uma experiência próxima e personalizada para médicos, equipes e pacientes, com acolhimento e organização em cada contato.',null,null,true,25,'{}'),
('physicians','De médico para médico','Você cuida da cirurgia. O Axis cuida da estrutura.','O Axis recebe médicos que buscam uma estrutura moderna, segura e organizada, com suporte à equipe médica e uma experiência de atendimento humanizada para seus pacientes.','Fale conosco e faça seu credenciamento','#contato',true,30,'{}'),
('process','Como funciona','Uma conversa clara, do primeiro contato à organização.','Um atendimento próximo e personalizado para entender o seu procedimento, apresentar a estrutura e orientar os primeiros passos do credenciamento.',null,null,true,40,'{"steps":["Fale com o Axis","Conte sua necessidade","Conheça a estrutura e as condições","Inicie seu credenciamento"]}'),
('education','Educação e atualização','Conhecimento que também circula.','O Axis possibilita a realização de aulas, treinamentos e cursos com transmissão de cirurgias ao vivo, promovendo educação, atualização profissional e troca de conhecimento.',null,null,true,45,'{}'),
('editorial_cta','Próximo passo','Seu próximo procedimento pode começar aqui.','Fale com nossa equipe para conhecer a estrutura, entender as condições e iniciar seu credenciamento.','Fale conosco e faça seu credenciamento','#contato',true,50,'{}')
on conflict(section_key) do nothing;

insert into public.differentials(title,description,active,sort_order) values
('Segurança','Segurança como base para procedimentos invasivos de curta permanência.',true,10),
('Tecnologia','Tecnologia de ponta integrada a uma estrutura moderna e organizada.',true,20),
('Suporte à equipe médica','Uma experiência de atendimento próxima, acolhedora e organizada para médicos, equipes e pacientes.',true,30);
