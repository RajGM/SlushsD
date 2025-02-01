'use client'

import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '@lib/context'
import { signIn } from '@lib/auth'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user } = useContext(UserContext)
  const router = useRouter()

  const handleClick = (path) => {
    if (user) {
      router.push(path)
    } else {
      signIn()
    }
  }

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          autoDisplay: true,
        }, 'google_translate_element');
      };
    };

    addGoogleTranslateScript();

    return () => {
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-400">Super Tutor AI</div>
        <div className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Community</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
          {!user && (
            <>
              <button onClick={() => handleClick('/tools')} className="px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600 transition-colors duration-300">Log in / SignUp</button>
            </>
          )}
          {user && (
            <>
              <button onClick={() => handleClick('/tools')} className="px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600 transition-colors duration-300">Tools</button>
            </>
          )}
          <div id="google_translate_element" className="inline-block ml-4"></div>
        </div>
      </nav>

      <style jsx global>{`
        #google_translate_element {
          display: inline-block;
          margin-left: 16px;
        }

        .goog-te-combo {
          background-color: #f97316;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 16px;
          border: none;
          outline: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .goog-te-combo:hover {
          background-color: #e06913;
        }

        /* Hide the Google branding */
        .goog-logo-link, .goog-te-gadget span {
          display: none !important;
        }

        /* Hide the second branding that sometimes appears */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }

        /* If there's a Google banner added to the top of the page */
        body {
          top: 0px !important;
        }
      `}</style>
    </header>
  )
}
