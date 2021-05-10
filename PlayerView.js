(function () {
  const Task = Backbone.Model.extend({
    defaults: {
      title: 'do something!',
      completed: false
    },
    validate: function (attrs) {
      if (_.isEmpty(attrs.title)) {
        return 'title must not be empty!'
      }
    },
    initialize: function () {
      this.on('invalid', function (model, error) {
        $('#error').html(error);
      })
    }
  });
  const Tasks = Backbone.Collection.extend({ model: Task });

  const TaskView = Backbone.View.extend({
    tagName: 'li',
    initialize: function () {
      this.model.on('destroy', this.remove, this),
      this.model.on('change', this.render, this)
    },
    events: {
      'click .delete': 'destroy',
      'click .toggle': 'toggle'
    },
    toggle: function () {
      this.model.set('completed', !this.model.get('completed'))
    },
    destroy: function () {
      if (window.confirm('are you sure?')) {
        this.model.destroy();
      }
    },
    remove: function () {
      this.$el.remove();
    },
    template: _.template($('#task-template').html()),
    render: function () {
      const template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }

  });
  const TasksView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
      this.collection.on('add', this.addNew, this);
      this.collection.on('change', this.updateCount, this);
      this.collection.on('destroy', this.updateCount, this);
    },
    addNew: function (task) {
      const taskView = new TaskView({ model: task });
      this.$el.append(taskView.render().el);
      $('#title').val('').focus();
      this.updateCount();
    },
    updateCount: function () {
        const uncompletedTasks = this.collection.filter(function (task) {
          return !task.get('completed');
        })
        $('#count').html(uncompletedTasks.length);
    },
    render: function () {
      this.collection.each(function (task) {
        const taskView = new TaskView({ model: task });
        this.$el.append(taskView.render().el);
      }, this);
      this.updateCount();
      return this;
    }
  });

  const AddTaskView = Backbone.View.extend({
    el: '#addTask',
    events: {
      'submit': 'submit'
    },
    submit: function (e) {
      e.preventDefault();
      // const task = new Task({ title: $('#title').val() })
      const task = new Task();
      if (task.set({ title: $('#title').val() }, { validate: true })) {
        this.collection.add(task);
        $('#error').empty();
      } else {
        //
      }
    }
  })

  const tasks = new Tasks([
    {
      title: 'title1',
      completed: true
    },
    {
      title: 'title2',
    },
    {
      title: 'title3',
    },
  ])

  const tasksView = new TasksView({ collection: tasks });
  const addTaskView = new AddTaskView({ collection: tasks });

  $('#tasks').html(tasksView.render().el);
})();
