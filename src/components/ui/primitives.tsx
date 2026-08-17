import{cn}from"@/lib/utils";
export function Container({children,className}:{children:React.ReactNode;className?:string}){return <div className={cn("container-axis",className)}>{children}</div>}
export function Eyebrow({children,className}:{children:React.ReactNode;className?:string}){return <p className={cn("eyebrow text-navy",className)}>{children}</p>}
export function Field({label,error,children}:{label:string;error?:string;children:React.ReactNode}){return <label className="grid gap-2 text-sm font-semibold text-navy"><span>{label}</span>{children}{error&&<span className="text-xs text-red-700" role="alert">{error}</span>}</label>}
export const inputClass="min-h-12 w-full border border-navy/20 bg-white px-4 text-base text-ink outline-none transition focus:border-navy";
export function EmptyState({title,description}:{title:string;description:string}){return <div className="border border-dashed border-navy/25 p-10 text-center"><h3 className="font-editorial text-3xl text-navy">{title}</h3><p className="mt-2 text-sm text-ink/65">{description}</p></div>}
export function Badge({children}:{children:React.ReactNode}){return <span className="inline-flex bg-navy/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">{children}</span>}
export function Skeleton({className}:{className?:string}){return <div className={cn("animate-pulse bg-navy/10",className)}/>}
