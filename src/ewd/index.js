/*

 ----------------------------------------------------------------------------
 | vue-ewd: Vue.js client module for EWD.js                                 |
 |                                                                          |
 | Copyright (c) 2020 Faisal Sami,                                          |
 | All rights reserved.                                                     |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  22 June 2020

*/

/* eslint-disable comma-dangle */
/* eslint-disable func-names */

import ewdClient from 'ewdjs-client';

// instantiation function to use ewdjs-client
export function EWD(params) {
  // set up start parameters for ewdjs-client
  const EWDJS = ewdClient.EWD || ewdClient;
  EWDJS.application = {
    name: params.application || 'unknown',
    onMessage: {}
  };
  EWDJS.url = params.url || null;
  EWDJS.customStart = true;

  EWDJS.vstart = EWDJS.vueStart = function() {
    EWDJS.start(params.io, EWDJS.url);
  };

  let registrationCallback = null;
  EWDJS.vueRegistrationCallback = EWDJS.vRegistrationCallback = function(callback) {
    registrationCallback = callback;
  };
  EWDJS.onReRegistered = function(obj, socket) {
    if (registrationCallback) { registrationCallback(true, 'ewd-reregistered'); }
  };
  EWDJS.onSocketsReady = function() {
    if (registrationCallback) { registrationCallback(true, 'ewd-registered'); }
  };

  EWDJS.application.onMessage.error = function() {
    if (registrationCallback) { registrationCallback(false, 'socketDisconnected'); }
  };

  // return the EWD client instance
  return EWDJS;
}
