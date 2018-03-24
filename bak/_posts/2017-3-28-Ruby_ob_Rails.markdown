---
layout: post
title:  "Ruby on Rails心得"
date:   2017-3-28 8:00:00 +0800
published:  true
categories: loiwu update
---


> rails new 'newapp'
> 新应用生成器

> rails server / rails s 
> 启动local web server

> rails generate / rails g controller 'ControllerClass' 'controllerMethod'
> 生成包含'controllerMethod'方法的'ControllerClass'控制器
> 生成了多个文件和一个路由
> 包括erb/test_unit/helper/assets/

> config/routes.rb
> DSL（domain-specific language，领域专属语言）
> [Rails 路由全解](http://guides.ruby-china.org/routing.html)

> 资源(resource)，该术语表示一系列类似对象的集合
> 资源可以被CRUD（Create, Read, Update, Delete）
> resources :articles
> 通过resources方法声明标准的REST资源
> rails routes命令查看所有标准REST动作具有的对应路由

> ruby中的public、private、protected三种方法
> public方法可作为控制器的动作

> .erb HTML模板处理器
> .builder XML模板处理器
> .coffee CoffeeScript创建JavaScript模板

> 创建'动作'.html.erb, 并放在app/views文件夹中

> 表单构建器 form_for 辅助方法 
> 调用 form_for 辅助方法时，需要为表单传递一个标识对象作为参数，这里是 :article 符号
> 在 form_for 辅助方法的块中，f 表示 FormBuilder 对象
> articles_path 辅助方法告诉 Rails 把表单指向和 articles 前缀相关联的 URI 模式
···ruby
<%= form_for :article, url: articles_path do |f| %>
  <p>
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </p>
  <p>
    <%= f.label :text %><br>
    <%= f.text_area :text %>
  </p>
  <p>
    <%= f.submit %>
  </p>
<% end %>
···

> rails generate model Article title:string text:text
> 创建模型
> Active Record

> rails db:migrate
> Rails 会执行迁移命令并告诉我们它创建了 Articles 表
> 迁移生产环境rails db:migrate RAILS_ENV=production
> 迁移默认开发环境rails db:migrate RAILS_ENV=development

> 在控制器中保存数据
···ruby
def create
  <!-- @article = Article.new(params[:article]) -->
  <!-- @article = Article.new(params.require(:article).permit(:title, :text)) -->
  @article = Article.new(article_params)
  @article.save
  redirect_to @article
end
private
  def article_params
    params.require(:article).permit(:title, :text)
  end
···
> [键壮参数](http://weblog.rubyonrails.org/2012/3/21/strong-parameters/)

> [Rails 布局和视图渲染](http://guides.ruby-china.org/layouts_and_rendering.html)

> [在 Rails 中使用 JavaScript](http://guides.ruby-china.org/working_with_javascript_in_rails.html)

> [Active Record 关联](http://guides.ruby-china.org/association_basics.html)

> [Ruby on Rails 安全指南](http://guides.ruby-china.org/security.html)

> 参考：
> [入门](http://guides.ruby-china.org/getting_started.html)

