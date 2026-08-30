update public.site_settings
set slogan = 'O seu hospital dia',
    updated_at = now()
where slogan = 'Sua cirurgia. Nossa estrutura.';

update public.page_sections
set title = 'O seu hospital dia',
    updated_at = now()
where section_key = 'hero';
