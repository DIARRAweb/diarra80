importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBsKMDF-nX-4tM_Hh0JPozZRuY9x9sFmh4",
  authDomain: "securite-53ada.firebaseapp.com",
  databaseURL:
    "https://securite-53ada-default-rtdb.firebaseio.com",
  projectId: "securite-53ada",
  storageBucket:
    "securite-53ada.firebasestorage.app",
  messagingSenderId: "675532854623",
  appId:
    "1:675532854623:web:4d0ada89aa82b9632852ea"
});

const messaging = firebase.messaging();
/*
Adresse officielle de cette version publique
de MaliPay.

Une seule ligne sera à modifier lors
d'un futur changement de dépôt GitHub.
*/
const MALIPAY_DASHBOARD_URL =
  "https://diarraweb.github.io/diarra67/dashboard.html";

/* =====================================================
   🔔 NOTIFICATION MALIPAY EN ARRIÈRE-PLAN
===================================================== */

messaging.onBackgroundMessage(
  async function(payload){

    console.log(
      "🔔 Notification MaliPay reçue :",
      payload
    );

    const data =
      payload.data || {};

    const title =
      data.title ||
      payload.notification?.title ||
      "MaliPay • Nouvelle notification";

    const body =
      data.body ||
      payload.notification?.body ||
      "Vous avez une nouvelle opération MaliPay.";

    const notificationOptions = {
      body,

      /*
      Icône principale visible dans
      la notification Android.
      */
      icon:
        "https://diarraweb.github.io/diarra68/malipay-notification-icon.png",

      /*
      Petit badge monochrome utilisé
      selon la version d’Android.
      */
      badge:
        "https://diarraweb.github.io/diarra68/malipay-notification-badge.png",

      /*
      Empêche plusieurs affichages identiques
      pour une même transaction.
      */
      tag:
        data.customID ||
        data.notificationId ||
        "malipay-notification",

      /*
      Une nouvelle transaction remplace seulement
      une notification portant exactement le même tag.
      */
      renotify: true,

      requireInteraction: false,

      silent: false,

      timestamp:
        Date.now(),

      data: {
        clickUrl:
          data.clickUrl ||
          MALIPAY_DASHBOARD_URL,

        type:
          data.type ||
          "general",

        customID:
          data.customID ||
          "",

        notificationId:
          data.notificationId ||
          "",

        senderPhone:
          data.senderPhone ||
          "",

        receiverPhone:
          data.receiverPhone ||
          "",

        senderName:
          data.senderName ||
          "",

        receiverName:
          data.receiverName ||
          ""
      }
    };

    await self.registration.showNotification(
      title,
      notificationOptions
    );
  }
);

/* =====================================================
   👆 CLIC SUR UNE NOTIFICATION MALIPAY
===================================================== */

self.addEventListener(
  "notificationclick",
  function(event){

    event.notification.close();

    console.log(
      "👆 Notification MaliPay ouverte :",
      event.notification.data
    );

    const clickUrl =
      event.notification.data?.clickUrl ||
      MALIPAY_DASHBOARD_URL;

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(windowClients => {

          for(const client of windowClients){

            if(
                "focus" in client &&
                client.url.startsWith(
                  "https://diarraweb.github.io/diarra67/"
                )
              ){
              client.navigate(clickUrl);
              return client.focus();
            }
          }

          if(clients.openWindow){
            return clients.openWindow(
              clickUrl
            );
          }

          return null;
        })
    );
  }
);