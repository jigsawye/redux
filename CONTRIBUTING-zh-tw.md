## 前置流程

把 `reactjs/redux` 加到 clone 下來專案的 remote

```sh
git remote add upstream https://github.com/reactjs/redux.git
```

## 更新流程 (參考用)

```sh
git checkout new-doc-zh-tw
git checkout -b doc-update # 隨便 branch 名稱
git fetch upstream
git merge upstream/master

# 解決衝突 ....然後 commit
# 發 Pull Request
```

## 發佈文件

```sh
npm run docs:publish
```
