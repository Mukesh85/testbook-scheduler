(function(){
	var app = angular.module("schedulerApp",[]);
	app.controller("controller1",function($scope, scheduler, FormComponents){
		var ctrl = this;

		ctrl.textControl1 = FormComponents.create({
			type:"text",
			label:"name"
		})

		ctrl.phoneControl = FormComponents.create({
			type:"phone",
			label:"phone"
		});

		ctrl.textControl2 = FormComponents.create({
			type:"text",
			label:"text",
			validate:false
		});

		ctrl.timeControl = FormComponents.create({
			type:"time",
			label:"time"
		});

		ctrl.showForm = false;

		ctrl.addToSchedules = function(){
			scheduler.addToScheduler({
				name:ctrl.textControl1.value,
				contact:ctrl.phoneControl.value,
				text:ctrl.textControl2.value,
				time:ctrl.timeControl.value
			});
			ctrl.toggleForm();
			ctrl.resetForm();
		}

		ctrl.resetForm = function(){
			ctrl.textControl1.value = "";
			ctrl.phoneControl.value = "";
			ctrl.textControl2.value = "";
			ctrl.timeControl.value = "";
			$scope.$broadcast('clear-form');
		}

		ctrl.toggleForm=function(){
			ctrl.showForm = !ctrl.showForm;
		}

		scheduler.startTimer();
	})
	.controller("controller2", function(scheduler){
		var ctrl = this;
		this.schedules = scheduler.schedules;
	})
	.service("scheduler",function(schedule, $interval){
		this.schedules = [];
		this.addToScheduler = function(initObj){
			this.schedules.push(schedule.create(initObj));
		}
		var service = this;
		this.startTimer = function(){
			$interval(function(){
				if(service.schedules.length > 0){
					for(i =0;i< service.schedules.length; i+=1){
						service.schedules[i].decrementTime();
						if(service.schedules[i].expired()){
							alert(service.schedules[i].text);
							service.schedules.splice(i,1);
						}
					}
				}
			},1000)
		}
	})
	.factory("schedule",function($interval){

		function schedule(initObj){
			this.name = initObj.name;
			this.contact = initObj.contact;
			this.text = initObj.text;
			this.time = initObj.time;

		}

		schedule.prototype.decrementTime = function(){
			this.time -= 1;
		}

		schedule.prototype.expired = function(){
			return !this.time >0;
		}

		function create(initObj){
			return new schedule(initObj);

		}

		return {
			create:create
		}


	})

	.factory("FormComponents", function(){

		var _components = [];

		function textComponent(initObj){
			this.label = initObj.label;
			
		}
		textComponent.prototype.validate = function(){
			if(this.value != null && this.value != undefined && this.value != "")
				return true;
			return false;
		}

		function phoneComponent(initObj){
			this.label = initObj.label;
			
		}
		phoneComponent.prototype.validate = function(){
			if(this.value != null && this.value != undefined && this.value != "" && this.value.length == 10)
				return true;
			return false;
		}

		function timeComponent(initObj){
			this.label = initObj.label;
			
		}
		timeComponent.prototype.validate = function(){
			if(this.value != null && this.value != undefined && this.value != "")
				return true;
			return false;
		}

		var create = function(initObj){
			var returnObj = null;
			if(initObj.validate === undefined) initObj.validate = true;
			if(initObj.type === "text" || initObj.type === "textArea"){
				returnObj = new textComponent(initObj);
			}
			else if(initObj.type === "phone"){
				returnObj = new phoneComponent(initObj);
			}
			else if(initObj.type === "time"){
				returnObj = new timeComponent(initObj);
			}
			
			if(!initObj.validate) returnObj.validate = function(){return true;}

			if(returnObj){
				this._components.push(returnObj);
			}
			return returnObj;
		}

		var validate = function(){
			if(this._components.length > 0){
				for(i in this._components){
					if(!this._components[i].validate()){
						return false;
					}
				}
				return true;
			}
			return true;
		}

		return {
			create:create,
			_components:[],
			validate:validate
		}
	})


	.directive("textComponent",function(){

		return{
			restrict:"E",
			templateUrl:"text-input.html",
			scope:{
				control:"="
			},
			link:function(scope, element, attr){
				scope.invalid = false;
				scope.valid = false;

				scope.$on('clear-form',function(){
					scope.invalid = false;
					scope.valid = false;
				});
								
				scope.blur = function(){
					if(scope.control.validate()){
						scope.invalid = false;
						scope.valid = true;
					}
					else{
						scope.invalid = true;
					}
				}
			}
		}

	})

	.directive("phoneComponent",function(){

		return{
			restrict:"E",
			templateUrl:'phone-input.html',
			scope:{
				control:"="
			},
			link:function(scope, element, attr){
				scope.invalid = false;
				scope.valid = false;
				scope.$on('clear-form',function(){
					scope.invalid = false;
					scope.valid = false;
				});
				angular.element(element).on("keypress",function(e){
					if(!(/^\d+$/.test(e.key)) || (scope.control.value && scope.control.value.length ==10)) e.preventDefault();
				});
				
				scope.blur = function(){
					if(scope.control.validate()){
						scope.invalid = false;
						scope.valid = true;
					}
					else{
						scope.invalid = true;
					}
				
				}
			}
		}

	})

	.directive("timeComponent",function(){

		return{
			restrict:"E",
			templateUrl:'time-input.html',
			scope:{
				control:"="
			},
			link:function(scope, element, attr){
				scope.invalid = false;
				scope.valid = false;
				angular.element(element).on("keypress",function(e){
					if(!(/^\d+$/.test(e.key))) e.preventDefault();
				});

				scope.$on('clear-form',function(){
					scope.invalid = false;
					scope.valid = false;
				});
				
				scope.blur = function(){
					if(scope.control.validate()){
						scope.invalid = false;
						scope.valid = true;
					}
					else{
						scope.invalid = true;
					}
				
				}
			}
		}

	})

	.directive("formContinue", function(FormComponents){

		return {
			retrict:"A",
			scope:{},
			link:function(scope, element){
				scope.$on('clear-form',function(){
					element.context.disabled = true;
				});
				scope.$watch(FormComponents.validate.bind(FormComponents),function(data){
					if(data)
						element.context.disabled = false;
					else
						element.context.disabled = true;
				});
				scope.click = function(){"hello"}
			}
		}

	})
})()