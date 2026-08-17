"use client";

export function CookiePreferencesButton(){return <button className="w-fit text-left" onClick={()=>dispatchEvent(new Event("axis:open-consent"))}>Preferências de cookies</button>}
