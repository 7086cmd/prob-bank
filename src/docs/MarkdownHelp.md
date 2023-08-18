# Markdown 语义声明

为了提升用户体验，我们决定使用 `Markdown` 进行渲染题目。但是由于 `Markdown` 多用于整页渲染，对于类似于 `prob-bank` 的单行式渲染虽然行之有效、高效，但是部分语义（如 `Header` ）并不适用，且部分的功能，如 `LaTeX` 本身并不启用。因此，这里对于 `Markdown` 在 `prob-bank` 作为题目内容渲染时支持的语义进行说明。

## 粗体

使用 `**` 包裹的文本将会被渲染为粗体。（提醒：为了区分粗体和斜体，我们规定：粗体的声明使用星号（\*\*），斜体则使用下划线（\_）

举例：

```
**芝士粗体**
```

**芝士粗体**

## 斜体

使用 `_` 包裹的文本将会被渲染为斜体。

举例：

```
_芝士斜体_
```

_芝士斜体_

## 上标

使用 `^` 包裹的文本将会被渲染为上标。

举例：

```
^芝士上标^
```

^芝士上标^

## 下标

使用 `~` 包裹的文本将会被渲染为下标。

举例：

```
~芝士下标~
```

~芝士下标~

## 公式

为了适应单行渲染的模式需要，我们仅支持由 `$` 包裹的单行（`inline`）公式。该部分也会在存储时另作处理，但是不会影响整体情况，且导出为 `Word` 时根据使用 `Microsoft Office` 或者 `WPS` 自动转换为不同类型的公式（`Microsoft Office` 为 `OMML` ，`WPS` 为 `WPS` 公式）。**（这里的渲染组件有点问题），您应当在录入题目的编辑框中进行编辑**

举例：

```
$E=mc^2$
```

$E=mc^2$

### 上下标

在 `LaTeX` 中，使用`^`字符作为上标、`_`字符作为下标。**注意，在这里不是包围**。在这里，如果是超过 1 个字符的上下标，需要使用 `{}` 包裹。

如上面的举例，您可以到编辑器中尝试输入：`$E=mc^2$`。

同时，比如说：

1. 使用`$m_1$`，我们就可以打出：$m_1$

2. 若要打出：$R_{MN}$ 则应当使用 `$R_{MN}$` 打出来。

### 分数、根式

使用`\cfrac`和`\sqrt`命令。

如：`$\cfrac{1}{2}$`，我们就可以打出：$\cfrac{1}{2}$

如：`$\sqrt{2}$`，我们就可以打出：$\sqrt{2}$

如果我们需要打出 3 次方根，可以使用`\sqrt[3]`命令。如：`$\sqrt[3]{2}$`，我们就可以打出：$\sqrt[3]{2}$

### 求和、积分

使用`\sum`和`\int`命令。

如：`$\sum_{i=1}^n$`，我们就可以打出：$\sum_{i=1}^n$

如：`$\int_{-\infty}^{+\infty}$`，我们就可以打出：$\int_{-\infty}^{+\infty}$

若是定积分，可以利用上下标，如：`$\int_a^b x^2\text{d}x$`，我们就可以打出：$\int_a^b x^2\text{d}x$

### 部分函数运算汇总

- 三角函数：

| 函数 | 命令 | 效果 |
| --- | --- | --- |
| $\sin$ | `\sin` | $\sin$ |
| $\cos$ | `\cos` | $\cos$ |
| $\tan$ | `\tan` | $\tan$ |

- 对数函数：

| 函数 | 命令 | 效果 |
| --- | --- | --- |
| $\log$ | `\log` | $\log$ |
| $\ln$ | `\ln` | $\ln$ |
| $\log_2 8$ | `\log_2 8` | $\log_2 8$ |

- 其他函数：

| 函数 | 命令 | 效果 |
| --- | --- | --- |
| $\max$ | `\max` | $\max$ |
| $\min$ | `\min` | $\min$ |
| $\lim$ | `\lim` | $\lim$ |

### 部分常用数学符号

| 符号 | 命令 | 效果 |
| --- | --- | --- |
| 无穷 | `\infty` | $\infty$ |
| 乘号 | `\times` | $\times$ |
| 点乘 | `\cdot` | $\cdot$ |
| 除号 | `\div` | $\div$ |
| 加减 | `\pm` | $\pm$ |
| 减加 | `\mp` | $\mp$ |
| 不等号 | `\neq` | $\neq$ |
| 大于等于 | `\geqslant` | $\geqslant$ |
| 小于等于 | `\leqslant` | $\leqslant$ |
| 不等于 | `\neq` | $\neq$ |
| 交集 | `\cap` | $\cap$ |
| 并集 | `\cup` | $\cup$ |
| 空集 | `\emptyset` | $\emptyset$ |
| 空集 | `\varnothing` | $\varnothing$ |
| 补集 | `\complement` | $\complement$ |
| 子集 | `\subset` | $\subset$ |
| 真子集 | `\subsetneq` | $\subsetneq$ |
| 超集 | `\supset` | $\supset$ |
| 真超集 | `\supsetneq` | $\supsetneq$ |
| 趋于 | `\to` | $\to$ |
| 属于 | `\in` | $\in$ |
| 圆 | `\odot` | $\odot$ |
| 三角形 | `\triangle` | $\triangle$ |
| 角 | `\angle` | $\angle$ |
| 平行 | `\parallel` | $\parallel$ |
| 垂直 | `\perp` | $\perp$ |
| 全等 | `\text{≌}` | $\text{≌}$ |
| 相似 | `\text{∽}` | $\text{∽}$ |
| 充分条件 | `\Longleftarrow` | $\Leftarrow$ |
| 必要条件 | `\Longrightarrow` | $\Rightarrow$ |
| 充要条件 | `\Longleftrightarrow` | $\Leftrightarrow$ |
| 全称量词 | `\forall` | $\forall$ |
| 存在量词 | `\exists` | $\exists$ |
| 圆周率 | `\pi` | $\pi$ |
| 因为 | `\because` | $\because$ |
| 所以 | `\therefore` | $\therefore$ |
| 间隔符 | `\mid` | $\mid$ |

### 部分常用希腊字母

| 字母 | 命令 | 效果 |
| --- | --- | --- |
| $\alpha$ | `\alpha` | $\alpha$ |
| $\beta$ | `\beta` | $\beta$ |
| $\gamma$ | `\gamma` | $\gamma$ |
| $\delta$ | `\delta` | $\delta$ |
| $\epsilon$ | `\epsilon` | $\epsilon$ |
| $\varepsilon$ | `\varepsilon` | $\varepsilon$ |
| $\zeta$ | `\zeta` | $\zeta$ |
| $\eta$ | `\eta` | $\eta$ |
| $\theta$ | `\theta` | $\theta$ |
| $\vartheta$ | `\vartheta` | $\vartheta$ |
| $\iota$ | `\iota` | $\iota$ |
| $\kappa$ | `\kappa` | $\kappa$ |
| $\lambda$ | `\lambda` | $\lambda$ |
| $\mu$ | `\mu` | $\mu$ |
| $\nu$ | `\nu` | $\nu$ |
| $\xi$ | `\xi` | $\xi$ |
| $\pi$ | `\pi` | $\pi$ |
| $\varpi$ | `\varpi` | $\varpi$ |
| $\rho$ | `\rho` | $\rho$ |
| $\varrho$ | `\varrho` | $\varrho$ |
| $\sigma$ | `\sigma` | $\sigma$ |
| $\varsigma$ | `\varsigma` | $\varsigma$ |
| $\tau$ | `\tau` | $\tau$ |
| $\upsilon$ | `\upsilon` | $\upsilon$ |
| $\phi$ | `\phi` | $\phi$ |
| $\varphi$ | `\varphi` | $\varphi$ |
| $\chi$ | `\chi` | $\chi$ |
| $\psi$ | `\psi` | $\psi$ |
| $\omega$ | `\omega` | $\omega$ |

### 部分常用大写希腊字母

| 字母 | 命令 | 效果 |
| --- | --- | --- |
| $\Gamma$ | `\Gamma` | $\Gamma$ |
| $\Delta$ | `\Delta` | $\Delta$ |
| $\Theta$ | `\Theta` | $\Theta$ |
| $\Lambda$ | `\Lambda` | $\Lambda$ |
| $\Xi$ | `\Xi` | $\Xi$ |
| $\Pi$ | `\Pi` | $\Pi$ |
| $\Sigma$ | `\Sigma` | $\Sigma$ |
| $\Upsilon$ | `\Upsilon` | $\Upsilon$ |
| $\Phi$ | `\Phi` | $\Phi$ |
| $\Psi$ | `\Psi` | $\Psi$ |
| $\Omega$ | `\Omega` | $\Omega$ |

### 部分上下标表示形式

| 表示形式 | 命令 | 效果 |
| --- | --- | --- |
| 箭头 | `\overrightarrow{AB}` | $\overrightarrow{AB}$ |
| 弧 | `\widehat{AB}` | $\widehat{AB}$ |
| 横线 | `\overline{AB}` | $\overline{AB}$ |

| 表示形式 | 命令 | 效果 |
| --- | --- | --- |
| 向量 | `\vec{a}` | $\vec{a}$ |
| 平均数 | `\bar{x}` | $\bar{x}$ |

### 部分箭头

| 箭头 | 命令 | 效果 |
| --- | --- | --- |
| 向左短单箭头 | `\leftarrow` | $\leftarrow$ |
| 向右短单箭头 | `\rightarrow` | $\rightarrow$ |
| 向左长单箭头 | `\longleftarrow` | $\longleftarrow$ |
| 向右长单箭头 | `\longrightarrow` | $\longrightarrow$ |
| 向左短双箭头 | `\Leftarrow` | $\Leftarrow$ |
| 向右短双箭头 | `\Rightarrow` | $\Rightarrow$ |
| 向左长双箭头 | `\Longleftarrow` | $\Longleftarrow$ |
| 向右长双箭头 | `\Longrightarrow` | $\Longrightarrow$ |
| 向左长双箭头 | `\Longleftrightarrow` | $\Longleftrightarrow$ |
| 向右长双箭头 | `\Longleftrightarrow` | $\Longleftrightarrow$ |
| 向上单箭头 | `\uparrow` | $\uparrow$ |
| 向下单箭头 | `\downarrow` | $\downarrow$ |
| 向上双箭头 | `\Uparrow` | $\Uparrow$ |
| 向下双箭头 | `\Downarrow` | $\Downarrow$ |
| 长等号（化学） | `\xlongequal{\triangle \text{Editable}}` | $\xlongequal{\triangle \text{Editable}}$ |

### 部分集合

| 集合 | 命令 | 效果 |
| --- | --- | --- |
| 自然数集 | `\mathbb{N}` | $\mathbb{N}$ |
| 整数集 | `\mathbb{Z}` | $\mathbb{Z}$ |
| 正整数集 | `\mathbb{N}_{+}` | $\mathbb{N}_{+}$ |
| 正整数集 | `\mathbb{N}^{*}` | $\mathbb{N}^{*}$ |
| 有理数集 | `\mathbb{Q}` | $\mathbb{Q}$ |
| 实数集 | `\mathbb{R}` | $\mathbb{R}$ |
| 复数集 | `\mathbb{C}` | $\mathbb{C}$ |

### 语义指导

#### 括号

使用括号时，**可以但是不建议**直接包围，最好应当是使用`\left`和`\right`标签进行包围，以便于自动调整大小。如：`$\left( \cfrac{1}{2} \right)$`，效果为：$\left( \cfrac{1}{2} \right)$

如果不使用，则会出现如下效果：$( \cfrac{1}{2} )$

| 括号 | 命令 | 效果 |
| --- | --- | --- |
| 小括号 | `\left( \right)` | $\left( \right)$ |
| 中括号 | `\left[ \right]` | $\left[ \right]$ |
| 大括号 | `\left\{ \right\}` | $\left\{ \right\}$ |
| 尖括号 | `\left< \right>` | $\left< \right>$ |
| 绝对值（行列式） | `\left\| \right\|` | $\left\| \right\|$ |
| 左侧单大括号 | `\left\{ \right.` | $\left\{ \right.$ |
| 集合 | `\left\{x \in \mathbb{R} \mid -2\leqslant \leqslant3 \right\}` | $\left\{x \in \mathbb{R} \mid -2\leqslant x \leqslant3 \right\}$ |

> 注意 1：`\left` 和 `\right` 必须成对出现，否则会出现错误。

> 注意 2：使用大括号，以及在表格中使用绝对值时，应当使用转义符号，如`\{`和`\|`。不然，前者因为与 `LaTeX` 语法冲突，会出现错误；后者因为与 `Markdown` 语法冲突，会出现错误。

> 注意 3：如果使用单括号，则不出现的一侧应当使用`.`进行占位，否则会出现错误。

#### 换行

如在行列式、矩阵等情况下，以及使用大括号列举情况~~证明全等~~时，应当使用`\\`进行换行。

举例：$\left\{ \begin{array}{l} x = 1 \\ y = 2 \end{array} \right.$

这时如果不使用`\left`等就会出现这样的情况：$\{ \begin{array}{l} x = 1 \\ y = 2 \end{array}$

#### 空格

在数学公式中，空格是不会被渲染的。如果需要空格，应当使用`\quad`、`\qquad`、`\ `等进行空格。

| 空格 | 命令 | 效果 |
| --- | --- | --- |
| 空格 | `\ ` | $1\ 2$ |
| 中等空格 | `\quad` | $1\quad2$ |
| 大空格 | `\qquad` | $1\qquad2$ |

~~因此，我们可以利用这个特性来出填空，如：$1\underline{\quad}2 \left(填>、<或=\right)$~~

#### 文本

正常而言，渲染数学公式的情况下，文本是斜体的。但是，如果需要使用正常的文本，应当使用`\text{}`进行包围。此时，不得使用`\`进行转义，否则会出现错误。

如：$x\text{ is a number}$

但是，如果觉得麻烦，其实如化学式，可以直接使用 `Markdown` 的上下标。其原因是我们在导出时，设置西文字体为 `Times New Roman` ，即正常印刷字体。

## 代码块

由于信息技术科目，我们需要支持代码块的渲染。但是这会最终渲染为模块，即不参与 `Markdown` 渲染，且关闭关键词高亮模块以适应试卷。导出为 `Word` 时，会自动改变字体。

渲染效果：

```python
print("Hello World!")
```

## 支持的 HTML 语义

由于使用 `HTML` 进行最终渲染呈现，但是由于安全原因（如防范 `XSS` 攻击），我们仅支持部分的 `HTML` 语义。

声明如下：

| 标签 | 用法 | 效果 |
| --- | --- | --- |
| `<b>` | 粗体 | <b>粗体</b> |
| `<i>` | 斜体 | <i>斜体</i> |
| `<sup>` | 上标 | <sup>上标</sup> |
| `<sub>` | 下标 | <sub>下标</sub> |
| `<u>` | 下划线 | <u>下划线</u> |
| `<br>` | 换行 | 略 |

## 不支持的语义列表

由于安全原因，我们不支持部分的 `HTML` 语义。同时由于单行渲染，不支持一些 `Markdown` 语义。

1. 图片。图片的渲染应当是每一题（小题也可以）最后的键值`images`作为统一插入以符合正常版式。
2. 表格。表格暂不支持，请等到正式版。
3. 代码块。代码块暂不支持，请等到正式版。
4. 列表。在题目中，该语义并不常用，因此暂不支持。
5. 引用。在题目中，该语义并不常用，因此暂不支持。
6. 链接。你总不可能在试卷上放链接吧？
7. 任务列表。在题目中，该语义并不常用，因此暂不支持。
8. 删除线。在题目中，该语义并不常用，因此暂不支持。

## 标准指导

为了统一题目登记的格式，方便统一管理、使用、导出，我们应当采用如下的规范：

### 数学题目

1. 句号使用全角点（不是全角句号）“．”；
2. 数学题目，除了 **“如图X”** 之类与汉字（中日韩字体）全部使用公式包围；
3. 在公式中，除了 **全等** 和 **相似** 符号无法转义以外，均必须使用转义符号；
4. 所有括号都使用`\left`和`\right`进行包围；
5. 所有的题目，如果图片是整一道题，应当整体插在题目的最后；如果仅供小题，则应当插在小题的最后；
6. （自动）如果题目图片的长宽比小于 2.5 ，系统会自动居右放置，反之居中；~~（致敬我家鸽鸽，击你胎没？）~~
7. 所有的“如图”，应当从图 1 开始计，不得使用“如图 1-2”之类的语句；
8. 单位必须使用 `\text` 进行包围，其他如未知数、角不得使用 `\text` 进行包围；
9. 不得使用 `LaTeX` 包围汉字，除了填空题的答案若是并列等以及证明理由；
10. 若在公式内，必须使用半角括号；
11. 证明理由应当使用 `\text` 进行包围；
12. 大于等于、小于等于应当使用`\geqslant`和`\leqslant`进行包围，而不是`\geq`和`\leq`；

### 物理题目

物理与数学要求均相同，但当使用如 `^{27}_{13}\text{Al}` 表示原子时，应当使用公式包围：$^{27}_{13}\text{Al}$

同时，表示核方程式时，应当使用箭头（`^2_1\text{H} + ^3_1\text{H} \to ^4_2\text{He} + ^1_0\text{n}`）：$^2_1\text{H} + ^3_1\text{H} \to ^4_2\text{He} + ^1_0\text{n}$

不得使用斜体表示质子、中子等粒子：

| 粒子 | 命令 | 效果 |
| --- | --- | --- |
| 质子 | `\text{p}` | $\text{p}$ |
| 中子 | `\text{n}` | $\text{n}$ |
| 电子 | `\text{e}` | $\text{e}$ |
| 中微子 | `v` | $v$ |
| 光子 | `\gamma` | $\gamma$ |
| 上夸克 | `\text{u}` | $\text{u}$ |
| 下夸克 | `\text{d}` | $\text{d}$ |

### 化学题目

1. 句号使用全角点（不是全角句号）“．”；
2. 化学式不应当使用公式包围，而应当使用 `Markdown` 的上下标，包括表示物质状态（必须使用半角括号）；
3. 化学方程式，应当使用`\xlongequal`；
4. 阿伏伽德罗常数，应当使用`N_A`，不得斜体；
5. 结构式应当使用绘制软件绘制后使用图片插入；
6. 所有题目的示意图，如果图片是整一道题，应当整体插在题目的最后；如果仅供小题，则应当插在小题的最后；
7. 表示电子轨道时，不应当使用公式，直接使用上标；
