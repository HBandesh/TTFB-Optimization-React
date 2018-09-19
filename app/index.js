import React from 'react';
import  {hydrate} from "react-dom";
import App from "./components/app";

hydrate(<App data={window.dataLayer}/>, document.getElementById('root'));


if(window) {
    let isSubscribed = false;
    let swRegistration;

    //button to enable disablew push notifications
    const  pushButton = document.getElementById("btnPush");
    //public key from https://web-push-codelab.glitch.me/
    const  applicationServerPublicKey = "BIZC9uQDm0U97k4QxrElAp6yKACUeRltH9nR5isFc81g7ORYg9R9yKSrdT-gEAPJOGMak7m5L2sNRw1HUV2G2XI";

    //register service worker
    navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
        console.log('Excellent, registered with scope: ', registration.scope);
        swRegistration = registration;
        setSubscriptionBtnText();
    });
    

  function setSubscriptionBtnText() {
      // Set the initial subscription value
      swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        isSubscribed = !(subscription === null);
    
        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
          subscribeUser();
        }
    
        updateBtn();
      });
  }

  function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log('User is subscribed.');
      //send subscruption end points to BE in future 
      updateSubscriptionOnServer(subscription);
  
      isSubscribed = true;
  
      updateBtn();
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
  }

  function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {
      console.log('Error unsubscribing', error);
    })
    .then(function() {
      updateSubscriptionOnServer(null);
  
      console.log('User is unsubscribed.');
      isSubscribed = false;
  
      updateBtn();
    });
  }

  function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server
  
    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
      document.querySelector('.js-subscription-details');
  
    if (subscription) {
      subscriptionJson.textContent = JSON.stringify(subscription);
      subscriptionDetails.classList.remove('is-invisible');
    } else {
      subscriptionDetails.classList.add('is-invisible');
    }
  }

  function updateBtn() {

    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked.';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }

    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }
  
    pushButton.disabled = false;
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

//event to prompt user to add to home screen
  window.addEventListener('beforeinstallprompt', (e) => {
    e.prompt();
  });

  //callback event for sub scribe/unscribe for notification
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });


}