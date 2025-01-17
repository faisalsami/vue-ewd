/*

 ----------------------------------------------------------------------------
 | vue-ewd: Vue.js client module for EWD.js                                 |
 |                                                                          |
 | Copyright (c) 2020 faisal Sami,                                          |                                               |
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

/**
 * Install plugin.
 */

import { EWD } from './ewd/index';

exports.EWD = EWD;
exports.VueEWD = {
  install: function(Vue, options) {
    const ewd = options.ewd;

    Vue.ewd = ewd;

    Object.defineProperties(Vue.prototype, {
      $ewd: {
        get() {
          return ewd;
        }
      }
    });
  }
};

/*
// don't enable because (ewd) option need to be passed in!
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueEWD)
}
*/
