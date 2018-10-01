---
path: "Angular/template-driven-forms-in-angular"
date: "2018-09-27"
title: "Template Driven Forms in Angular"
tags: ["Angular","Forms"]
category: "Angular"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://medium.com/@agoiabeladeyemi/template-driven-forms-in-angular-4a3a5ad960de"
type: "Post"
---

* * *

Template Driven Forms in Angular
================================

Template driven forms are forms where we write logic, validations, controls etc, in the template part of the code (html code). The template is responsible for setting up the form, the validation, control, group etc. Template driven forms are suitable for simple scenarios, uses two way data binding using the \[(NgModel)\] syntax, easier to use though unit testing might be a challenge.

### Enabling Template Driven Forms?

To use the template driven form, we need to explicitly import `{FormsModule}` in our application module from `@angular/forms`
```
import { FormsModule } from '@angular/forms'; //note this

@Component({...})
export class App { }

@NgModule({
  declarations: \[App\],
  imports: \[BrowserModule, FormsModule\],      //note this too
  bootstrap: \[App\]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

### ngModel:

We need the `ngModel` in the form input, and the input must be named too:

`<input type="text" ngModel name="firstName">`

There are cases where we need pass an event listener to the input field, or pass the value of the input to our component, we need assign a template variable to the input to do that.
```
<input type="text" ngModel
       name="firstName"
       #firstName="ngModel"
       (change)="doSomething(firstName)"
\>
```
ngModel is an instance of the `FormControl` which has quite a number of controls which include dirty, invalid, errors, pristine, touched, untouched, value etc. The FormControl class is use to track the state changes of our input.

### ngForm:

The ngForm is an instance of the FormGroup. The FormGroup represents the group of FormControl, each form is a FormGroup because it will have at least one FormControl that gives us access to `(ngSubmit)` which can be bind to a method in our component.
```
<form #f="ngForm" (ngSubmit)="submit(f)">
  <input type="text" ngModel
         name="firstName"
         #firstName="ngModel"
         (change)="doSomething(firstName)"
  >
</form>
```
The `FormGroup` also has a lot of properties similar to the `FormControl` like dirty, errors, invalid, parent, etc.

### ngModelGroup:

At times, when building a complex form. Need might arise where we need make a particular object a parent to some other inputs, so we can access those inputs under the parent, hence the need for `ngModelGroup`. We can access the firstName and lastName under the person object.

```
<form #f="ngForm" (ngSubmit)="submit(f)">
  <div ngModelGroup="person">
     <input type="text" ngModel
           name="firstName"
           #firstName="ngModel"
           (change)="doSomething(firstName)"
     >

     <input type="text" ngModel
           name="lastName"
           #lastName="ngModel"
           (change)="doAnotherthing(lastName)"
     >
  </div>
</form>
```

### Dealing with Select Options?

To deal with select options, we need to use the ngModel and also name the select option like we have been doing earlier. We then use the \*ngFor to loop through the options if its coming from the component/backend

```
//assuming we have an array of objects like below in our component
export class MyFormComponent {
  myOptions = \[
    {id: 1, name: "abel"},
    {id: 2, name: "agoi"},
    {id: 3, name: "adeyemi"},
  \];
}

//below is how we will use the above in our template
//my-form-template.html

<select ngModel name="person">
  <option \*ngFor="let myOption of myOptions" \[value\]="myOption.id">
      {{ myOption.name }}
  </option>
</select>


//not coming from database
<select ngModel name="person">
  <option value="1">abel</option>
  <option value="2">agoi</option>
  <option value="3">adeyemi</option>
</select>
```

### Dealing with Check Boxes?

To deal with check boxes, we need to use the ngModel and also name the select option like we have been doing earlier.
```
<label>
  <input type="checkbox" ngModel name="like"> Like this article?
</label>
```
Since the checkbox does not have the value property, when you click on the checkbox, a value of true is assigned to the like but false is applied when you unclick.

### Dealing with Radio Buttons?

To deal with radio buttons, we need to use the ngModel and also name the select option like we have been doing earlier.

```
<label>
  <input type="radio" ngModel name="clap" value="2"> 2 claps?
</label>

<label>
  <input type="radio" ngModel name="clap" value="3"> 3 claps?
</label>
```

Selecting any of the above radio button will update the value of the ngModel to the value of the one selected. We can load the radio button dynamically as well like below:

```
<label \*ngFor="let myOption of myOptions">
  <input type="radio" ngModel name="clap" \[value\]="myOption.id">
  {{ myOption.name }}
</label>
```

* * *

### Adding Validation

We are going to look at adding html validation and properly displaying appropriate errors when the validation fails. The key things we are going to hook unto are `touch` and `valid` status of our form control or form group

**required:** is use to enforce the user that the input must be filled.

`<input type="text" ngModel name="firstName" required>`

We can use the valid property of the `FormControl` to display appropriate message if the validation fails, we also need to be sure that the form has been touched before concluding that validation failed, hence the need for `touch`

```
<input type="text" ngModel name="firstName" #firstName="ngModel" required>

<div \*ngIf="firstName.touch && ! firstName.valid">
  Firstname is required
</div>
```

The error message `Firstname is required` will only display if the input was touched and was not filled. We have to always assign the form control variable `#firstName="ngModel"` to be able to do display the validation message.

**Maxlength, Minlength and Pattern:** The `Maxlength` is use to enforce the maximum number of characters an input can accept. The `Minlength` is use to efforce the minimum number of characters an input can accept. The Pattern attribute is mostly use for regular expression validation on form input. When we have multiple validation on an input, we can to individually check for error like below:

```
<input type="text" ngModel
       name="firstName" #firstName="ngModel"
       minlength="3"
       maxlength="10"
       required
\>

<div \*ngIf="firstName.touch && ! firstName.valid">
  <div \*ngIf="firstName.errors.required">
    Firstname is required
  </div
  <div \*ngIf="firstName.errors.minlength">
    Firstname minimum length is
    {{ firstName.errors.minlength.requiredLength }}
  </div>
  <div \*ngIf="firstName.errors.maxlength">
    Firstname maximum length is
    {{ firstName.errors.maxlength.requiredLength }}
  </div>
</div>
```

**ng-invalid, ng-dirty, ng-touched:** angular automatically attach these classes to our input when the input is invalid, dirty and touched. `ng-invalid` is added when the validation fails or requirement not met, `ng-dirty` is added when the user has interacted with the input, `ng-touched` is added when the user has lost focus. We can increase the usability of our form by using these dynamic classes to style our form like below:
```
<input type="text" ngModel
       name="firstName" #firstName="ngModel"
       minlength="3"
       maxlength="10"
       required
       class="form-control"
\>
```

Assuming we have a class `.form-control` added to our form input, knowing fully well angular will add the `.ng-touched, .ng-dirty, .ng-touched` when it should, we can add those classes to our style to increase our form interaction.

```
.form-control.ng-touched.ng-invalid {
  border: 2px solid red;
}
```
![](https://cdn-images-1.medium.com/max/800/1*E-zIm5g7TB61OXmEgTsQag.png)

**Disabling submit button:** we can disable the form submit button or just any input easily in angular. I will disable the submit button in our case when the entire form is invalid.
```
<form #f="ngForm" (ngSubmit)="submit(f)">

  <input type="text" ngModel
         name="firstName"
         #firstName="ngModel"
         (change)="doSomething(firstName)"
  >
  <input type="text" ngModel
         name="lastName"
         #lastName="ngModel"
         (change)="doAnotherthing(lastName)"
  >

  <button \[disabled\]="!f.valid">Submit</button>
</form>
```
We assigned the `[disabled]` to the `!f.valid` , The `#f` is the variable name assigned to the form.

The validations done here are just the inbuilt html 5 validations, we can build our own custom validations. There is also another way to build forms in angular known as reactive forms. Will write on that too soon.
