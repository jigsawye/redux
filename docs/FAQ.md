# Redux FAQ

## 一般常見問題

### 我應該什麼時候使用 Redux？

早期的 React contributor 之一，Pete Hunt 說：

> 你會知道你哪時候需要 Flux。如果你不確定你是否需要，那就是不需要了。

同樣的，Redux 的 creator Dan Abramov 這麼說：

> 我會想要修改程：不要使用 Redux，直到你在原生的 React 發生了問題。

一般來說，在當你有合理的資料量會隨著時間的推移而改變時使用 Redux，你需要真相的唯一來源，而且你發現像是把所有東西保存在頂層 React component 的 state 之類的方法不再是足夠的。

#### 更多資訊
**文件**
- [簡介：動機](introduction/Motivation.md)

**討論**
- [React How-To](https://github.com/petehunt/react-howto)
- [Twitter - Don't use Redux until...](https://twitter.com/dan_abramov/status/699241546248536064)
- [The Case for Flux](https://medium.com/swlh/the-case-for-flux-379b7d1982c6)
- [Stack Overflow - Why use Redux over Facebook Flux?](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux)
- [Stack Overflow - Why should I use Redux in this example?](http://stackoverflow.com/questions/35675339/why-should-i-use-redux-in-this-example)
- [Stack Overflow - What could be the downsides of using Redux instead of Flux?](http://stackoverflow.com/questions/32021763/what-could-be-the-downsides-of-using-redux-instead-of-flux)

### Redux 只能用在 React 嗎？

在任何的 UI 層，Redux 可以被用來當作資料儲存。最常見的就是被用在 React，但可以被 bind 用在 Angular、Vue、Mithril，甚至更多。Redux 只是提供一個訂閱的機制，它可以被用在任何其他的程式碼。


### 我需要特定的建立工具來使用 Redux 嗎？

Redux 是由 ES6 所撰寫的，並建立於 Webpack 和 Babel。然而，它應該是可以用在任何 JavaScript 建立過程中。還有一個是 UMD 版本，可以不需要任何建立工具就可以使用。[counter-vanilla](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla) 範例透過引用 Redux 的 script 來示範使用 ES5 來撰寫 Redux。像是這個 Pull Request 加入了這段話：

> 新的 Counter Vanilla example 範例針對 Redux 普遍的誤解需要 Webpack、React、hot reloading、sagas、 action creators、constants、Babel、npm、CSS modules、decorators、fluent Latin、一個 Egghead 的訂閱、一個 PhD，或是一個超過預期的 O.W.L. 水準。

> 不是，只需要 HTML 還有一些 `<script>` tag 的引入，簡單的透過 DOM 來操作就可以了。Enjoy！


## Reducers

### 我要如何在兩個 reducers 共用 state？我一定要使用 `combineReducers` 嗎？

Redux store 建議的結構是透過 key 來拆分成多個 「slice」或「domains」state 物件，並提供一個單獨的 reducer function 來管理每個獨立的資料部份。這是類似於標準的 Flux 模式有多個獨立的 store，而 Redux 提供了 [`combineReducers`](api/combineReducers.md) function 讓這個模式更加簡單。然而，重要的是要注意到 `combineReducers` 不是必要的 - 它是一個簡單有效的工具，對於共同使用具有單一的 reducer function 的 state 切分和簡單的 JavaScript 物件的資料。

許多使用者之後想要嘗試在兩個 reducer 間共用資料，但是發現 `combineReducers` 不允許他們這麼做。這裡有幾種可以使用的方法：

* 如果 reducer 需要知道資料是來自 state 的哪個部份，store 應該需要重新被組合，讓單一的 reducer 可以處理更多的資料。
* 你可能需要撰寫一些自訂的 function 來處理一些 action。這可能需要將你的頂層 reducer function 來替代 `combineReducers`。你也可以使用一些有用的工具像是 [reduce-reducers](https://github.com/acdlite/reduce-reducers) 來執行 `combineReducers` 來處理大量的 action，但也執行更多 reducer 跨越不同 state 部份來指定 action。
* [非同步 action creators](advanced/AsyncActions.md) 像是 `redux-thunk` 可以透過 `getState()` 存取所有的 state。Action creator 可以從 state 或是一個 action 取得額外的資料，所以每個 reducer 有更多的資訊可以更新他們本身的 state 部份。

一般情況下，記住 reducer 只是 function - 你可以根據你想要的方式來組織和區分他們，並鼓勵你將他們拆分成更小的部份，可複用的 function （「reducer decomposition」）。你只需要確保這些 reducer 都遵守這些基本的規則： `(state, action) -> newState`，透過更新 state 來取得新的 state，而不要直接的修改 state。

#### 進一步的資訊
**文件**
- [API: combineReducers](api/combineReducers.md)

**討論**
- [#601 - A concern on combineReducers, when an action is related to multiple reducers](https://github.com/reactjs/redux/issues/601)
- [#1400 - Is passing top-level state object to branch reducer an anti-pattern?](https://github.com/reactjs/redux/issues/1400)
- [Stack Overflow - Accessing other parts of the state when using combined reducers?](http://stackoverflow.com/questions/34333979/accessing-other-parts-of-the-state-when-using-combined-reducers)
- [Stack Overflow - Reducing an entire subtree with redux combineReducers](http://stackoverflow.com/questions/34427851/reducing-an-entire-subtree-with-redux-combinereducers)
- [Sharing State Between Redux Reducers](https://invalidpatent.wordpress.com/2016/02/18/sharing-state-between-redux-reducers/)


### 我一定要使用 switch 條件式來處理 action 嗎？

不是的，你可以使用任何你想要的方式在 reducer 中來回應 action。switch 條件式只是最常見的方法，比 if 條件式來的好，透過查詢 function 的列表，或者是在抽象過程中建立一個 function

#### 進一步的資訊
**文件**
- [Recipes: Reducing Boilerplate](recipes/ReducingBoilerplate.md)

**討論**
- [#883 - take away the huge switch block](https://github.com/reactjs/redux/issues/883)
- [#1167 - Reducer without switch](https://github.com/reactjs/redux/issues/1167)


## 組織 State

### 我一定要把我所有的 state 放入 Redux 嗎？我應該使用 React 的 setState 嗎？

這沒有「正確」的答案。有些使用者喜歡將每個單一的資料部份放入 Redux，來管理完全序列化以及在任何時候都可以控制應用程式的版本。O有些人則偏好 non-critical 或 UI state，像是「目前打開的下拉選單」，內部 component 的內部 state。其實只要找到一個你覺得平衡的方式就可以了。

在 community 有各種大量不同的實作，來替代每個 component 的 state 儲存到 Redux 的 store 方法，像是 [redux-ui](https://github.com/tonyhb/redux-ui), [redux-component](https://github.com/tomchentw/redux-component)、[redux-react-local](https://github.com/threepointone/redux-react-local)，還有更多其他不同實作。

#### 進一步的資訊
**討論**
- [#159 - Investigate using Redux for pseudo-local component state](https://github.com/reactjs/redux/issues/159)
- [#1098 - Using Redux in reusable React component](https://github.com/reactjs/redux/issues/1098)
- [#1287 - How to choose between Redux's store and React's state?](https://github.com/reactjs/redux/issues/1287)
- [#1385 - What are the disadvantages of storing all your state in a single immutable atom?](https://github.com/reactjs/redux/issues/1385)
- [Stack Overflow - Why is state all in one place, even state that isn't global?](http://stackoverflow.com/questions/35664594/redux-why-is-state-all-in-one-place-even-state-that-isnt-global)
- [Stack Overflow - Should all component state be kept in Redux store?](http://stackoverflow.com/questions/35328056/react-redux-should-all-component-states-be-kept-in-redux-store)


### 我可以在 store state 內放置 function、promise、或其他非序列的項目嗎？

強烈建議你在 store 只放置簡單的序列化的物件、陣列、還有 primitives。在_技術上_可以新增非序列的項目到你的 store，但是這麼做會打破不可變的原則還有 store 儲存的內容。

#### 進一步的資訊
**討論**
- [#1248 - Is it ok and possible to store a react component in a reducer?](https://github.com/reactjs/redux/issues/1248)
- [#1279 - Have any suggestions for where to put a Map Component in Flux?](https://github.com/reactjs/redux/issues/1279)
- [#1390 - Component Loading](https://github.com/reactjs/redux/issues/1390)
- [#1407 - Just sharing a great base class](https://github.com/reactjs/redux/issues/1407)


### 我要如何在我的 state 組織巢狀化和重複的資料？

一般來說，資料和 IDs、巢狀化、或是關聯的資料應該被儲存在「normalize」的方式中 - 每個物件應該只被儲存一次，透過 ID 來標記，以及其他參考的物件應該只儲存 IDs，而不是複製整個物件。它可以幫助在思考 store 像是在使用資料庫一樣，和每個獨立項目列類型的「資料表」。像是 [normalizr](https://github.com/gaearon/normalizr) 和 [redux-orm](https://github.com/tommikaikkonen/redux-orm) 的 library 可以提供幫助和管理抽象的 normalize 資料。


#### 進一步的資訊
**文件**
- [Advanced: Async Actions](advanced/AsyncActions.md)
- [Examples: Real World example](introduction/Examples.html#real-world)


**討論**
- [#316 - How to create nested reducers?](https://github.com/reactjs/redux/issues/316)
- [#815 - Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [#946 - Best way to update related state fields with split reducers?](https://github.com/reactjs/redux/issues/946)
- [#994 - How to cut the boilerplate when updating nested entities?](https://github.com/reactjs/redux/issues/994)
- [#1255 - Normalizr usage with nested objects in React/Redux](https://github.com/reactjs/redux/issues/1255)



## Store 建立

### 我可以（應該）建立多個 store 嗎？我可以直接匯入我的 store，然後在我的 component 中使用嗎？

原來的 Flux 模式描述有多個「store」在你的應用程式，每一個 store 擁有不同的資料部份。這裡介紹一些 issue，像是 store 需要「等待」其他的 store 更新。Redux 設計上使用這個概念並將它變化，在 Redux 的 store 中，每個獨立的 Flux store 會是分離的 reducer 。

正如其他的幾個問題，在一個頁面中它是_可以_建立多個不同的 Redux store，但是預期的模式只會有一個單一的 store。然而，擁有單一的 store 可以使用 Redux DevTools，讓不變和 rehydrate 的資料更簡單，並簡化了訂閱的邏輯。

同樣的，你同時_可以_直接引入你的 store 參考實例，但這不是 Redux 推薦的模式。對於 React 使用方式，透過 React-Redux `connect()` function 產生包覆的 class 來實際的尋找 `props.store`，但是最好的方式是在你的頂部 component 使用一個 `<Provider store={store} />`，讓 Reac-Redux 去擔心你的 store。直接引入 store 也很難在伺服器端進行 render。


#### 進一步的資訊
**文件**
- [API: Store](api/Store.md)


**討論**
- [#1346 - Is it bad practice to just have a 'stores' directory?](https://github.com/reactjs/redux/issues/1436)
- [Stack Overflow - Redux multiple stores, why not?](http://stackoverflow.com/questions/33619775/redux-multiple-stores-why-not)
- [Stack Overflow - Accessing Redux state in an action creator](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator)


### 是不是可以有多個 middleware 鏈在我的 store enhancer？在 middleware function 的「next」和「dispatch」的區別是什麼？

Redux middleware 的行為像是一個連結清單。每個 middleware function 可以呼叫 `next(action)` 來傳送一個 action 到下一個 middleware，呼叫 `dispatch(action)` 來重新開始處理清單，或是將正在進一步處理的 action 停止。

當建立 store 時，一連串的 middleware 透過參數來定義並被傳送到 `applyMiddleware` function。定義多個 middleware 鏈無法正常的執行，因為他們明顯有不同參考的 `dispatch`，而且不同的鏈可以有效的被分開。

#### 進一步的資訊
**文件**
- [Advanced: Middleware](advanced/Middleware.md)
- [API: applyMiddleware](api/applyMiddleware.md)

**討論**
- [#1051 - Shortcomings of the current applyMiddleware and composing createStore](https://github.com/reactjs/redux/issues/1051)
- [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
- [Exploring Redux Middleware](http://blog.krawaller.se/posts/exploring-redux-middleware/)


### 我要如何只訂閱部份的 state？我可以取得 dispatch action 當做訂閱的一部分嗎？

Redux 提供了 `store.subscribe` 方法來通知 listeners store 已經更新。Listener callbacks 不會將目前取得的 state 當作參數 - 他只是一個指出_那些_ state 已經改變。訂閱者可以呼叫 `getState()` 來取得目前的值。

這個 API 被作為一個 low-level 的 primitive 沒有任何的依賴或是複雜性，而且可以用在建立 high-level 的訂閱邏輯。像是 React-Redux 的 UI binding 可以建立一個訂閱給每個被連結的 component。It is also possible to write functions that can intelligently compare the old state vs the new state, 它也是可以撰寫 function，而且可以聰明地比較舊的和新的 state，如果某些 state 改變了也可以執行附帶的邏輯。範例包含了 [redux-watch](https://github.com/jprichardson/redux-watch) 和 [redux-subscribe](https://github.com/ashaffer/redux-subscribe)，提供不同的方法來指定訂閱和處理變化。

為了排除特殊的情況和簡化實作的附加功能，像是 `Redux DevTools`，新的 state 不會傳送到 listeners。另外，訂閱者的目的是反應 state 本身，而不是 action，如果需要處理 action 可以使用 Middleware。

#### 進一步的資訊
**文件**
- [Basics: Store](basics/Store.md)
- [API: Store](api/Store.md)

**討論**
- [#303 - subscribe API with state as an argument](https://github.com/reactjs/redux/issues/303)
- [#580 - Is it possible to get action and state in store.subscribe?](https://github.com/reactjs/redux/issues/580)
- [#922 - Proposal: add subscribe to middleware API](https://github.com/reactjs/redux/issues/922)
- [#1057 - subscribe listener can get action param?](https://github.com/reactjs/redux/issues/1057)
- [#1300 - Redux is great but major feature is missing](https://github.com/reactjs/redux/issues/1300)


## Actions

### 為什麼「type」要是一個字串，或是至少可以序列化？為什麼我的 action type 要是常數？

與 state 相同，具有可以序列化的 action 是 Redux 定義的功能，像是 time travel debugging，以及 recording 和 replaying actions。使用一些像是 Symbol 的 「type」的值可能會破壞這些。字串序列化可以簡單的描述本身，所以是更好的選擇。請注意，如果 action 是要提供給 middleware 使用，在 action 內可以使用 Symbol、Promise，或是其他非序列化的數值 - 在實際到達 store 和傳送給 reducer 時，action 只需要可以被序列化。

封裝和集中常用的程式碼部份是程式設計中的一個關鍵概念。雖然每個部份可能都要手動建立 action 物件，還要手動撰寫每個「type」的值，定義可複用的常數讓你維護程式碼更容易。


#### 進一步的資訊
**文件**
- [Reducing Boilerplate](http://rackt.github.io/redux/docs/recipes/ReducingBoilerplate.html#actions)

**討論**
- [#384 - Recommend that Action constants be named in the past tense](https://github.com/reactjs/redux/issues/384)
- [#628 - Solution for simple action creation with less boilerplate](https://github.com/reactjs/redux/issues/628)
- [#1024 - Proposal: Declarative reducers](https://github.com/reactjs/redux/issues/1024)
- [#1167 - Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Stack Overflow - Why do you need 'Actions' as data in Redux?](http://stackoverflow.com/q/34759047/62937)
- [Stack Overflow - What is the point of the constants in Redux?](http://stackoverflow.com/q/34965856/62937)


### reducer 和 action 之間一定是一對一互相對應嗎？

實際上，建議的模式是各個 reducer function 負責各部分的 state 進行更新 - 「reducer composition」模式。一個指定的 action 可以處理所有或是部份 state，也可以沒有。一個指定的 action 可以處理所有或是部份 state，或是完全沒有。有些使用者選擇將 action 和 reducer 更緊密的 bind 在一起，像是「duck」檔案結構， 但預設上不一定要一對一互相對應。

#### 進一步的資訊
**文件**
- [Basics: Reducers](basics/Reducers.md)

**討論**
- [Twitter - most common Redux misconception](https://twitter.com/dan_abramov/status/682923564006248448)
- [#1167 - Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Reduxible #8 - Reducers and action creators aren't a one-to-one mapping](https://github.com/reduxible/reduxible/issues/8)
- [Stack Overflow - Can I dispatch multiple actions without Redux Thunk middleware?](http://stackoverflow.com/questions/35493352/can-i-dispatch-multiple-actions-without-redux-thunk-middleware/35642783)

### 我如何表達像是呼叫 AJAX 的 「side eeffects」？為什麼我們需要像是「action creators」、「thunks」、以及「middleware」來執行非同步的行為？

這是一個冗長以及複雜的問題，要如何將各式各樣的程式碼組織以及應該使用什麼樣的方法。

任何有意義的 web 應用程式都會需要執行複雜的邏輯，通常包括像是非同步的 AJAX 請求。程式碼不再是單純的輸入 function，以及和外部世界之間相互作用被稱為[「side effects」](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29)。

Redux 的靈感來自於 functional programming，它是可以直接使用的，不會有任何的 side effects 執行。尤其是 reducer function，它 **必須** 是 `(state, action) -> newState` 的 pure function。然而，Redux 的 middleware 讓它可以攔截被 dispatch 的 action 並附加額外的複雜行為，包含 side effects。

一般來說，Redux 建議具有 side effect 的程式碼應該是 action creation 處理的一部分。而邏輯_可以_在 UI component 內部被執行，更有意義的方式是將可複用的 function 抽出，相同的邏輯可以在其他地方被呼叫使用 - 換句話說，是一個 action creator function。

最簡單和最常見的方式是增加 [redux-thunk](https://github.com/gaearon/redux-thunk) middleware，讓你可以撰寫更複雜或是非同步邏輯的 action creator。一個被廣泛使用的方法是 [redux-saga](https://github.com/yelouafi/redux-saga)，它使用 generator 讓你可以撰寫更多像是同步的程式碼，可以像是「背景執行序」或「daemons」在你的 Redux 應用程式。另一個方法是 [redux-loop](https://github.com/raisemarketplace/redux-loop)，允許你的 reducer 來宣告 side effects 在回應時的 state 改變，並讓他們分開執行反轉的處理。此外，有_許多_其他由 community 所開發的 library 以及 ideas，每個 libray 都有自己管理 side effects 的方法。


#### 進一步的資訊
**文件**
- [Advanced: Async Actions](advanced/AsyncActions.md)
- [Advanced: Async Flow](advanced/AsyncFlow.md)
- [Advanced: Middleware](advanced/Middleware.md)

**討論**
- [#291 - Trying to put API calls in the right place](https://github.com/reactjs/redux/issues/291)
- [#455 - Modeling side effects](https://github.com/reactjs/redux/issues/455)
- [#533 - Simpler introduction to async action creators](https://github.com/reactjs/redux/issues/533)
- [#569 - Proposal: API for explicit side effects](https://github.com/reactjs/redux/pull/569)
- [#1139 - An alternative side effect model based on generators and sagas](https://github.com/reactjs/redux/issues/1139)
- [Stack Overflow - Why do we need middleware for async flow in Redux?](http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux)
- [Stack Overflow - How to dispatch a Redux action with a timeout?](http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559)
- [Stack Overflow - Where should I put synchronous side effects linked to actions in redux?](http://stackoverflow.com/questions/32982237/where-should-i-put-synchronous-side-effects-linked-to-actions-in-redux/33036344)
- [Stack Overflow - How to handle complex side-effects in Redux?](http://stackoverflow.com/questions/32925837/how-to-handle-complex-side-effects-in-redux/33036594)
- [Stack Overflow - How to unit test async Redux actions to mock ajax response](http://stackoverflow.com/questions/33011729/how-to-unit-test-async-redux-actions-to-mock-ajax-response/33053465)
- [Stack Overflow - How to fire AJAX calls in response to the state changes with Redux?](http://stackoverflow.com/questions/35262692/how-to-fire-ajax-calls-in-response-to-the-state-changes-with-redux/35675447)
- [Reddit - Help performing Async API calls with Redux-Promise Middleware.](https://www.reddit.com/r/reactjs/comments/469iyc/help_performing_async_api_calls_with_reduxpromise/)
- [Twitter - possible comparison between sagas, loops, and other approaches](https://twitter.com/dan_abramov/status/689639582120415232)
- [Redux Side-Effects and You](https://medium.com/@fward/redux-side-effects-and-you-66f2e0842fc3)
- [Pure functionality and side effects in Redux](http://blog.hivejs.org/building-the-ui-2/)

### 我應該從 action creator 連續 dispatch 多個 action 嗎？

沒有具體的規定你該如何建構你的 action。使用一個非同步 middleware 像是 redux-thunk，像是 dispatch 連續多個但是不相關的 action，dispatch action 來表示 AJAX 請求、dispatch action 基於 state 的狀態、 甚至是 dispatch 一個 action，然後立即檢查更新後的狀態。

一般來說，這些 action 是相關但是獨立的，或者實際上可能是相同的。根據你的情況使用有意義的方式，並基於可讀性和 debug。


#### 進一步的資訊
**討論**
- [#597 - Valid to dispatch multiple actions from an event handler?](https://github.com/reactjs/redux/issues/597)
- [#959 - Multiple actions one dispatch?](https://github.com/reactjs/redux/issues/959)
- [Stack Overflow - Should I use one or several action types to represent this async action?](http://stackoverflow.com/questions/33637740/should-i-use-one-or-several-action-types-to-represent-this-async-action/33816695)
- [Stack Overflow - Do events and actions have a 1:1 relationship in Redux?](http://stackoverflow.com/questions/35406707/do-events-and-actions-have-a-11-relationship-in-redux/35410524)
- [Stack Overflow - Should actions be handled by reducers to related actions or generated by action creators themselves?](http://stackoverflow.com/questions/33220776/should-actions-like-showing-hiding-loading-screens-be-handled-by-reducers-to-rel/33226443#33226443)


## 程式碼結構

### 我的檔案結構應該長什麼樣子？在我的專案中，我應該如何組織我的 action creator 和 reducer？我的 selector 應該在哪？

因為 Redux 只是一個資料 store library，它沒有直接的方法來如何建構你的專案。然而，有少數幾個是 Redux 開發者最常傾向使用的模式：

- Rails 風格：「actions」、「constants」、「reducers」、「containers」、「components」獨立的資料夾。
- Domain 風格：每個功能或 domain 單獨的資料夾，可能有每個檔案類型的子資料夾。
- 「Ducks」：類似於 domain 風格，but explicitly tying together actions and reducers, 但是明確的把 action 和 reducer 綁在一起，通常會將他們定義在同個檔案中。

一般認為，selector 應該和 reducer 一起被定義然後匯出，接著在其他地方重新使用（像是在 `mapStateToProps` functions 或者是在非同步 action creators）來隱藏實際的 store 形狀。

#### 進一步的資訊
**討論**
- [#839 - Emphasize defining selectors alongside reducers](https://github.com/reactjs/redux/issues/839)
- [#943 - Reducer querying](https://github.com/reactjs/redux/issues/943)
- [React-Boilerplate #27 - Application Structure](https://github.com/mxstbr/react-boilerplate/issues/27)
- [Stack Overflow - How to structure Redux components/containers](http://stackoverflow.com/questions/32634320/how-to-structure-redux-components-containers/32921576)
- [Redux Best Practices](https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e)
- [Rules For Structuring (Redux) Applications ](http://jaysoo.ca/2016/02/28/organizing-redux-application/)

### 我應該如何將我的 reducer 和 action creator 之間的邏輯拆開？我的「business logic」應該在哪裡？

邏輯放置的部份沒有一個明確的答案應該在 reducer 或是 action creator。有些開發者偏好「fat」action creator、「thin」reducer，action 可以簡單的將資料 merge 到相對應的 state，其他人則嘗試保持 action，讓它盡可能的簡單，在 action creator 盡量避免使用到 `getState`。

這個討論總結了一個不錯的二分法 ︰

> 現在的問題是要將什麼放在 action creator、什麼要在 reducer 中，以及 fat 和 thin action 物件之間的選擇。如果你把所有的邏輯放在 action creator，fat action 物件基本上是宣告 state 更新的結果。Reducer 是 pure、dumb、新增、移除、更新的這些功能。他們會更容易 compose。但不代表你大部分的 business 邏輯都會在那裡。
> 你如果在 reducer 上放了許多邏輯，你就可以有 thin action 物件，大部分的資料邏輯都在一個地方，但是你的 reducer 會很困難 compose，因為你可能需要來自其他 branch 的資訊。你最後可能有一個很大的 reducer 或是 reducer 帶有其他額外的參數來自上層的 state。


#### 進一步的資訊
**討論**
- [#1165 - Where to put business logic / validation?](https://github.com/reactjs/redux/issues/1165)
- [#1171 - Recommendations for best practices regarding action-creators, reducers, and selectors](https://github.com/reactjs/redux/issues/1171 )
- [Stack Overflow - Accessing Redux state in an action creator??](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575)


## 效能

### 依據效能和結構方面來說，如何架構和「scale」Redux ？

依然沒有一個明確的答案，大多數這個時候不應該關注這兩種情況。

一般 Redux 所作的工作分為幾個領域：處理在 middleware 的 action 和 reducer（包含複製不可變得物件來進行更新），在 action 被 dispatch 後通知訂閱者，以及基於 state 的改變來更新 UI component。雖然這些很有_可能_在充滿複雜的情況下變成性能上的問題，但 Redux 的實做本身沒有什麼什麼緩慢和低效的問題。事實上，React-Redux 特別做了大量的優化，減少了不必要的 re-render。

在結構當中，Redux 在各個專案和團隊中都工作的非常順利，數百家公司和上千位開發者目前都在使用 Redux，在 NPM 達到一個月幾十萬次的安裝。一位開發者的報告：

> 在規模上，我們有 ~500 action types、~400 reducer cases、~150 components、5 middlewares、~200 actions、 ~2300 tests

#### 進一步的資訊
**討論**
- [#310 - Who uses Redux?](https://github.com/reactjs/redux/issues/310)
- [Reddit - What's the best place to keep the initial state?](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)
- [Reddit - Help designing Redux state for a single page app](https://www.reddit.com/r/reactjs/comments/48k852/help_designing_redux_state_for_a_single_page/)
- [Reddit - Redux performance issues with a large state object?](https://www.reddit.com/r/reactjs/comments/41wdqn/redux_performance_issues_with_a_large_state_object/)
- [Twitter - Redux scaling](https://twitter.com/NickPresta/status/684058236828266496)


### 如果在每個 action 呼叫 「我所有的 reducer」會變慢嗎？

重要的是，注意 Redux store 一個 reducer function。store 傳送目前的 state 和 dispatch action 到一個 reducer function，並讓 reducer 做適當的處理。

很明顯的，將單一的 function 擴充並嘗試處理每個 action 不是這麼容易，簡單來說在於 function 的大小和可讀性，所以要將實際的工作分離成獨立的 function 讓頂層的 reducer 可以呼叫。特別是，共同建議的模式是，有一個獨立的 reducer function 根據指定的 key 負責管理部份的 state 的更新，透過使用提供的 `combineReducers` 工具可以讓程式變得更簡單。但還是強烈建議將你的 store 扁平化、序列化。最後，你可以根據你需要的方式來組織 reducer 邏輯。

然而，即便剛好你有許多不同獨立的 reducer，甚至有很深的巢狀 state，reducer 的速度不太可能是一個問題。JavaScript Engine 可以在每秒呼叫並執行大量的 function，你大部份的 reducer 可能都使用 switch 語句，預設上大部分 action 的回應都會回傳存在的 state。

如果你很擔心 reducer 實際上的效能，你可以是用像是 [redux-ignore](https://github.com/omnidan/redux-ignore) 或 [reduxr-scoped-reducer](https://github.com/chrisdavies/reduxr-scoped-reducer) 的工具來確保某些 reducer 只監聽指定的 action。你還可以使用 [redux-log-slow-reducers](https://github.com/michaelcontento/redux-log-slow-reducers) 來做一些效能的基準測試。

#### 進一步的資訊
**討論**
- [#912 - Proposal: action filter utility](https://github.com/reactjs/redux/issues/912)
- [#1303 - Redux Performance with Large Store and frequent updates](https://github.com/reactjs/redux/issues/1303)
- [Stack Overflow - State in Redux app has the name of the reducer](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer/35674297)
- [Stack Overflow - How does Redux deal with deeply nested models?](http://stackoverflow.com/questions/34494866/how-does-redux-deals-with-deeply-nested-models/34495397)


### 我需要在我的 reducer 深層複製我的 state 嗎？複製 state 不會導致變慢嗎？

Immutable 的更新 state 一般的意思是說淺層拷貝，而不是深層複製。淺層複製比深層複製來的快，因為較少的物件和欄位被複製，以及可以有效的歸納變動的部份。

然而，你需要_將_每個受影響的巢狀層面，建立一個複製和更新的物件。雖然這應該不是特別昂貴，這是一個很好的理由為什麼你應該保持 state 的序列化以及淺層複製。

> Redux 常見的誤解：你需要深層 clone state。實際上：如果內部的 state 沒有改變，保持相同的參考！


#### 進一步的資訊
**討論**
- [#454 - Handling big states in reducer](https://github.com/reactjs/redux/issues/454)
- [#758 - Why can't state be mutated?](https://github.com/reactjs/redux/issues/758)
- [#994 - How to cut the boilerplate when updating nested entities?](https://github.com/reactjs/redux/issues/994)
- [Twitter - common misconception - deep cloning](https://twitter.com/dan_abramov/status/688087202312491008)
- [Cloning Objects in Javascript](http://www.zsoltnagy.eu/cloning-objects-in-javascript/)

### 我如何減少 store 更新事件的次數？

Redux 在每次成功 dispatch action 會知訂閱者（意思是，action 已經去改變 store，並透過 reducer 來處理）。在有些情況下，它可能對於減少呼叫多次訂閱者是有幫助的，特別是如果一個 action creator 連續 dispatch 多個不同的 action。在 community 有一些 addons，在大量的 action 被 dispatch 後，提供透過批次的方式來通知訂閱者，像是 [redux-batched-updates](https://github.com/acdlite/redux-batched-updates)、[redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) 或 [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)。

#### 進一步的資訊
**討論**
- [#125 - Strategy for avoiding cascading renders](https://github.com/reactjs/redux/issues/125)
- [#542 - Idea: batching actions](https://github.com/reactjs/redux/issues/542)
- [#911 - Batching actions](https://github.com/reactjs/redux/issues/911)
- [React-Redux #263 - Huge performance issue when dispatching hundreds of actions](https://github.com/reactjs/react-redux/issues/263)

### 如果只有「一個 state tree」會造成記憶體上的問題嗎？如果多次 dispatch 許多 action 會佔用記憶體嗎？

首先，在原始記憶體的使用方面，Redux 和其他的 JavaScript libray 沒有什麼不同。唯一的區別是所有的物件參考都被巢狀化成一個 tree，而不是儲存在各個獨立的 model 實例，像是：Backbone。第二，a typical Redux app would probably have somewhat _less_ memory usage than an equivalent Backbone app, 一個典型的 Redux app 記憶體使用 _稍微_ 會比 Backbone app 來的少，因為 Redux 鼓勵你使用純 JavaScript 物件和陣列，而不是建立 Model 和 Collection 的實例。最後，Redux 在每個時間點只有單一 state tree 的參考。根據標準，物件如果不再被 tree 參考將會被垃圾回收。

Redux 不會 store action 本身的歷史記錄。然而，Redux DevTools 可以 store action 所以他們可以被 replay，但是一般只會在開發期間使用，不會使用在上線環境。

#### 進一步的資訊
**文件**
- [Docs: Async Actions](advanced/AsyncActions.md])

**討論**
- [Stack Overflow - Is there any way to "commit" the state in Redux to free memory?](http://stackoverflow.com/questions/35627553/is-there-any-way-to-commit-the-state-in-redux-to-free-memory/35634004)
- [Reddit - What's the best place to keep initial state?](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)




## React-Redux

### 為什麼我的 compoent 不會 re-rendering，或者是執行我的 mapStateToProps？

為什麼 componet 在 action 被 dispatch 後不會 re-render，到目前為止最常見的原因是因為你無意間直接 mutate 或修改你的 state。Redux 期望你的 reducer 更新 state 是「immutably」的，意思是你總是需要複製你的資料，這是有效的，並將你的 state 改變運用到副本。如果你從 reducer 回傳相同的物件，Redux 會假設一切都沒有改變，即使你對內容進行修改。同樣的，React-Redux 透過 `shouldComponentUpdate` 在淺層平等參考來檢查傳入的 props 去嘗試改善效能，如果所有的參考都是相同的，回傳 false 來跳過實際更新你的原始 component。

很重要的是你要記得，每當你更新巢狀的值，你必須在你的 state tree 中回傳任何以上的新副本。如果你有 `state.a.b.c.d`，然你想要更新 `d`，你應該需要回傳 `c`、`b`、`a` 以及 `state` 的新副本。這個 [state tree mutation 關係圖](http://arqex.com/wp-content/uploads/2015/02/trees.png) 表示了如何改變在 tree 深層的 state，需要一路的往上改變。


注意到「immutably 的更新資料」意思_不是_你必須使用 Immutable.js library，儘管這當然是一種選擇。你可以透過純 JavaScript 物件和陣列使用不同的方式來達到 immutable 的更新資料：
- 使用 function 像是 Object.assign() / \_.extend() 來複製物件，陣列的話使用像是 slice() 和 concat() 的 function。
- 在 ES6 陣列的展開運算符，還有類似物件的展開運算符，已經提出建議了但是還沒有通過。
- 有用的 library 可以將 immutable 的更新邏輯包裝成簡單的 function。


#### 進一步的資訊
**文件**
- [Troubleshooting](Troubleshooting.md)
- [React-Redux: Troubleshooting](https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md)
- [Recipes: Using the Object Spread Operator](recipes/UsingObjectSpreadOperator.md)

**討論**
- [#1262 - Immutable data + bad performance](https://github.com/reactjs/redux/issues/1262)
- [React-Redux #235 - Predicate function for updating component](https://github.com/reactjs/react-redux/issues/235)
- [React-Redux #291 - Should mapStateToProps be called every time an action is dispatched?](https://github.com/reactjs/react-redux/issues/291)
- [Stack Overflow - Cleaner/shorter way to update nested state in Redux?](http://stackoverflow.com/questions/35592078/cleaner-shorter-way-to-update-nested-state-in-redux)
- [Gist - state mutations](https://gist.github.com/amcdnl/7d93c0c67a9a44fe5761#gistcomment-1706579)
- [Pros and Cons of Using Immutability with React](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)

### 為什麼我的 componenty 時常 re-rendering？

React-Redux 實作了許多優化來確保你實際的 component 只有當必要時才重新 render。傳送到 `connect` 的 `mapStateToProps` 和 `mapDispatchToProps` 參數，在產生 combine props 物件時，其中之一會進行 shallow equality 的檢查。不幸的是，shallow equality 沒辦法幫助在每次 `mapStateToProps` 被呼叫時，新的陣列和物件實例被建立的情況。一個典型的例子可能是 map 所有陣列裡的 IDs 以及回傳對應到的參考物件，像是：

```js
let mapStateToProps = (state) => {
    return {
        objects : state.objectIds.map(id => state.objects[id])
    }
};
```

儘管每次陣列可能有完全相同的參考物件，陣列本身是一個不同的參考，所以 shallow equality 會確認失敗，React-Redux 會 re-render 被包覆的 component。

透過儲存物件的陣列，使用 reducer 進入到 state，可以解決額外的重新 render，快取和 memoize 使用 Reselect library 來 map 陣列，或是在你的 component 實作 `shouldComponentUpdate` ，使用像是 `_.isEqual` 的 function 做更深入的 props 對照。

對於非 connect 的 component，你可能會想要檢查哪些 props 被傳送了。一個常見的 issue 是有一個父 component 重新 bind 一個 callback 在 render function 內，像是 `<Child onClick={this.handleClick.bind(this)} />`。每次父 component 重新 render，會建立一個新的參考 function。在你的父 component 的 constructor 中，一般好的作法只能 bind callback 一次。



#### 進一步的資訊

**討論**
- [Stack Overflow - Can a React-Redux app scale as well as Backbone?](http://stackoverflow.com/questions/34782249/can-a-react-redux-app-really-scale-as-well-as-say-backbone-even-with-reselect)
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)


### 我如何將我的 mapStateToProps 加速？

當你的 `mapStateToProps` function 被呼叫時，React-Redux 盡量減少工作的次數，這是一個好的想法來確保你的 `mapStateToProps` 執行快速，而且也減少大量的工作時間。普遍推薦的方法是使用 [Reselect](https://github.com/reactjs/reselect) library 建立 memoize 的「selector」function。這些 selector 可以一起被 combine 和 compose，在傳遞過程之後的的 selector，只有當輸入有變化時才會執行。這意思說你可以建立像是過濾和排序的 selector，如果需要的話，確保只發生在真實的工作上。

#### 進一步的資訊
**文件**
- [Recipes: Computed Derived Data](recipes/ComputingDerivedData.md)

**討論**
- [#815 - Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [Reselect #47 - Memoizing Hierarchical Selectors](https://github.com/reactjs/reselect/issues/47)


### 為什麼我在我 connect 的 component 沒有 `this.props.dispatch` 可以使用？

`connect` function 有兩個主要參數，兩者是可選的。首先，`mapStateToProps`，它是一個 funcion，當 store 發生改變時，你提供一個方法從 store 將 state 拉回，然後將這些值當作 props 傳送到你的 component。第二，`mapDispatchToProps`，它是一個 function，讓你提供 store 的 dispatch function 來使用，通常透過建立 action creator 預先綁定的版本，當他們被呼叫時可以自動 dispatch 這些 action。

如果當呼叫 `connect` 時，你不想提供你的 `mapDispatchToProps` function，React-Redux 會提供一個預設的版本，簡單的回傳 `dispatch` 當作 props。這意思說，假設你_提供_自己的 function，`dispatch` 就_不會_自動的提供了。如果仍然想要可以當作 props 來使用，在你的 `mapDispatchToProps`  實做你需要顯式回傳它。


#### 進一步的資訊
**文件**
- [React-Redux API: connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)


**討論**
- [React-Redux #89 - can i wrap multi actionCreators into one props with name?](https://github.com/reactjs/react-redux/issues/89)
- [React-Redux #145 - consider always passing down dispatch regardless of what mapDispatchToProps does](https://github.com/reactjs/react-redux/issues/145)
- [React-Redux #255 - this.props.dispatch is undefined if using mapDispatchToProps](https://github.com/reactjs/react-redux/issues/255)
- [Stack Overflow - http://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux/34458710](How to get simple dispatch from this.props using connect w/ Redux?)


### 我應該只 connect 我的頂層 component，或者我可以在我的 tree 中 connect 更多的 component？

早期的 Redux 文件建議你應該只能有幾個在你頂層附近 component tree 可以被 connect。然而，時間和經驗可以表示，通常需要幾個 component 知道所有其他 component 所需要的資料，強迫他們往下傳送大量令人困惑的 props。

目前建議的最好的做法是將你的 component 分類成「presentational」或「container」，無論怎麼樣，確實的 connect container component：

> 強調「一個 conatiner component 在頂層」在 Redux 範例中是一個錯誤，不要認為這是一句名言。嘗試將你的 presentation component 保持獨立。透過 connect 他們來建立 container component 會更方便。每當你感覺你在父 component 複製程式碼，來提供資料給相同的子 component，就是你抽出 container 的時候。一般你之要感覺到父 component 知道太多關於子 component 的「個人」的資料或 action，就是你抽出 container 的時候。

一般情況下，嘗試理解資料流和你的 component 的責任，並在這之間找到一個平衡。

#### 進一步的資訊
**文件**
- [Basics: Usage with React](basics/UsageWithReact.md)


**討論**
- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Twitter - emphasizing "one container" was a mistake](https://twitter.com/dan_abramov/status/668585589609005056)
- [#419 - Recommended usage of connect](https://github.com/reactjs/redux/issues/419)
- [#756 - container vs component?](https://github.com/reactjs/redux/issues/756)
- [#1176 - Redux+React with only stateless components](https://github.com/reactjs/redux/issues/1176)
- [Stack Overflow - can a dumb component use a Redux container?](http://stackoverflow.com/questions/34992247/can-a-dumb-component-use-render-redux-container-component)



## 雜項

### 有沒有任何更大的、「真正的」Redux 專案？

Redux 的「範例」資料夾有很多各種不同複雜程度的 sample 專案，包含一個「real-world」範例。雖然許多公司都正在使用 Redux，但他們的應用程式都是版權而不可使用的。A large number of Redux-在 Github 上可以找到大量相關的 Redux 專案，像是 [Stack Overflowund-Redux](https://github.com/andrewngu/sound-redux)。

#### 進一步的資訊
**文件**
- [Introduction: Examples](introduction/Examples.md)


**討論**
- [Reddit - Large open source react/redux projects?](https://www.reddit.com/r/reactjs/comments/496db2/large_open_source_reactredux_projects/)
- [HN - Is there any huge web application built using Redux?](https://news.ycombinator.com/item?id=10710240)


### 我該如何在 Redux 實作身分驗證？

身分驗證在任何真實的應用程式都是必要的。有關身份驗證的時候你必須記得，這對於你應該如何組織你的應用程式一點都沒有影響，你應該以同樣的方式來實作身份驗證。它非常簡單：

1. 為成功登入和登入失敗或是其他的動作，建立 action constant

2. 建立 actionCreators 帶有一個 type、憑證、一個 flag 來表示身分驗證是 true 或 false、一個 token、或一個做為資料的錯誤訊息

3. 建立一個非同步的 action creator 和 redux-thunk middleware 或任何你覺得適合觸發網路請求的 middleware 到一個 api，如果憑證有效，回傳一個 token 並可以儲存到 local storage 或一個 response 給使用者，如果要處理失敗的話，透過步驟二中所建立合適的 actionCreators 來處理。

4. 建立一個 reducer，在每個可能驗證的情況（登入成功、登入失敗）來回傳 next state。

#### 進一步的資訊

**討論**
- [Authentication with JWT by Auth0](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
- [Tips to Handle Authentication in Redux](https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7)
- [react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)
- [redux-auth](https://github.com/lynndylanhurley/redux-auth)
