// import Link from 'next/link';
// import React from 'react'; 
// import { usePathname } from 'next-intl/navigation';

// type Locale = 'en' | 'et' | 'ru';

// export const LanguageSwitcher = (): JSX.Element => {
//     const pathname = usePathname(); 

//     const locales: Locale[] = ['en', 'et', 'ru']; 

//     return (
//         <div className="language-switcher-main-block">
//             {locales.map((language: Locale) => {
//                 return (
//                     <div className="language-switcher-button-wrapper" key={language}>
//                         <Link 
//                             className={`language-switcher-link ${language === locale ? 'language-switcher-link--active' : ''}`} 
//                             href={pathname} 
//                             locale={language} 
//                         >
//                             {language}
//                         </Link>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };