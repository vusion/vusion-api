<!-- 该 README.md 根据 api.yaml 和 docs/*.md 自动生成，为了方便在 GitHub 和 NPM 上查阅。如需修改，请查看源文件 -->

# USidebar 侧边栏

<u-toc>
    <u-toc-item label="基础示例" to="examples">
        <u-toc-item label="基本用法" :to='{"path":"examples","hash":"#基本用法"}'></u-toc-item>
        <u-toc-item label="只读、禁用、禁用某一项" :to='{"path":"examples","hash":"#只读-禁用-禁用某一项"}'></u-toc-item>
        <u-toc-item label="分隔符" :to='{"path":"examples","hash":"#分隔符"}'></u-toc-item>
        <u-toc-item label="分组" :to='{"path":"examples","hash":"#分组"}'></u-toc-item>
        <u-toc-item label="颜色扩展" :to='{"path":"examples","hash":"#颜色扩展"}'></u-toc-item>
    </u-toc-item>
    <u-toc-item label="USidebar API" :to='{"path":"api","hash":"#usidebar-api"}'>
        <u-toc-item label="Props/Attrs" :to='{"path":"api","hash":"#propsattrs"}'></u-toc-item>
        <u-toc-item label="Slots" :to='{"path":"api","hash":"#slots"}'></u-toc-item>
        <u-toc-item label="Events" :to='{"path":"api","hash":"#events"}'></u-toc-item>
        <u-toc-item label="Methods" :to='{"path":"api","hash":"#methods"}'></u-toc-item>
    </u-toc-item>
    <u-toc-item label="USidebarItem API" :to='{"path":"api","hash":"#usidebaritem-api"}'>
        <u-toc-item label="Props/Attrs" :to='{"path":"api","hash":"#propsattrs-2"}'></u-toc-item>
        <u-toc-item label="Slots" :to='{"path":"api","hash":"#slots-2"}'></u-toc-item>
        <u-toc-item label="Events" :to='{"path":"api","hash":"#events-2"}'></u-toc-item>
    </u-toc-item>
    <u-toc-item label="USidebarGroup API" :to='{"path":"api","hash":"#usidebargroup-api"}'>
        <u-toc-item label="Props/Attrs" :to='{"path":"api","hash":"#propsattrs-3"}'></u-toc-item>
        <u-toc-item label="Slots" :to='{"path":"api","hash":"#slots-3"}'></u-toc-item>
        <u-toc-item label="Events" :to='{"path":"api","hash":"#events-3"}'></u-toc-item>
    </u-toc-item>
    <u-toc-item label="USidebarDivider API" :to='{"path":"api","hash":"#usidebardivider-api"}'></u-toc-item>
</u-toc>

<s-component-labels :labels='["路由链接","块级展示"]'></s-component-labels>

通常用于页面左侧的导航栏。

<u-h2-tabs router>
    <u-h2-tab title="基础示例" to="examples"></u-h2-tab>
    <u-h2-tab title="API" to="api"></u-h2-tab>
</u-h2-tabs>
<router-view></router-view>
