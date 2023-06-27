import { md2c } from '../src/utils/md2c'

const lib = [
  '如图1，锐角$\\triangle ABC$内接于$\\odot O$，$D$为$BC$的中点，连结$AD$并延长交$\\odot O$于点$E$，连结$BE$，$CE$，过$C$作$AC$的垂线交$AE$于点$F$，点$G$在$AD$上，连结$BG$，$CG$，若$BC$平分$\\angle EBG$且$\\angle BCG=\\angle AFC$．',
  '求$\\angle BGC$的度数．',
  '求证：$AF=BC$；',
  '若$AG=$DF，求$\\tan\\angle GBC$的值．',
  '如图2，当点$O$恰好在BG上且$OG=1$时，求$AC$的长．',
]

lib.forEach(item => {
  console.log(md2c(item))
})
