# Digital Girl — The Frame Is a Lie

使用 Remotion、React、TypeScript 与原创 SVG 角色制作的完整程序化动画 MV。唯一正式音轨为用户提供的 **Digital Girl — Jinja.mp3**。

## 输出

- `output/digital-girl-mv.mp4`：1920×1080，30fps，完整歌曲。
- `output/digital-girl-short.mp4`：1080×1920，30fps，独立竖屏构图，最后一次副歌。
- `output/thumbnail.png`：1920×1080，YouTube 封面。
- `output/checks/`：实际关键帧、歌词边界检查与成片验证报告。

## 在当前云环境运行

```bash
cd /workspace/Digital-Girl
bash scripts/environment-install.sh
npm run studio
```

Studio 使用 3000 端口。云环境 onboarding 界面不提供 localhost 预览链接；渲染输出可以直接检查和下载。

```bash
npm run analyze      # 完整 MP3 分析、逐词校验，写入 generated/
npm run typecheck
npm run frames       # 导出关键帧
npm run render       # 横版成片
npm run short        # 独立竖版
npm run thumbnail
node scripts/render.mjs audit        # 逐行检查实际字体边界
node scripts/render.mjs audit-short
```

系统基础工具：Node 24、Python 3.12、FFmpeg 7、Chromium。Node 依赖由 `package-lock.json` 固定，Python 依赖由 `requirements.lock.txt` 固定。字体与许可证均随项目保存，无远程字体请求。渲染并发为 3，适配当前 4 核、32 GiB 环境。

## 文件组织

- `public/assets/`：原始素材的逐字节副本，另有代码生成的纸纹。
- `generated/`：完整音频特征、歌词、结构、素材 SHA-256、短片选择依据。
- `src/characters/DigitalGirl.tsx`：唯一角色模型与姿态。
- `src/timeline/timeline.ts`：统一时间线、分镜、节拍、能量与逐词查询。
- `src/scenes/`：开场、觉醒、破界、记忆、内心、外望、删除、逃离与结尾。
- `src/Short.tsx`：竖屏专用舞台。
- `docs/style-bible.md`、`docs/storyboard.md`：美术与导演规则。
- `docs/research.md`：联网研究的实际访问结果与限制。

上传的 MP3、LRC、JSON 未被修改。生成分析不是分离音轨；低频、打击和人声频段为能量代理指标。逐词时间沿用上传 JSON 的官方 MIDI 重建与 LRC 对齐结果。当前聊天接口不支持返回音频的听觉审阅，最终音频以解码、时长、波形相关性与封装检查验证。
