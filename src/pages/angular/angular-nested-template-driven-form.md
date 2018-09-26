---
path: "Angular/angular-nested-template-driven-form"
date: "2018-09-26"
title: "Angular: Nested template driven form"
tags: ["Angular","Forms"]
category: "Angular"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://medium.com/@a.yurich.zuev/angular-nested-template-driven-form-4a3de2042475"
type: "Post"
---
Angular: Nested template driven form

In this article i am going to show how we can build nested angular template drived form.

I am assuming you have already known what ngForm, ngModel, ngModelGroup directives are for.

So let’s start with simple form:
```
<form #myForm="ngForm">
  <div>
    <label>Firstname:</label>
    <input type="text" name="firstName" ngModel>
  </div>
  <div>
    <label>Lastname:</label>
    <input type="text" name="lastName" ngModel>
  </div>
</form>
<pre>{{ myForm.value | json }}</pre>
```
Stackblitz example

There is nothing new here for those how do it every day. We’ve written form containing firstName and lastName fields and we’re expecting the result like:

```
{
  "firstName": "",
  "lastName": ""
}
```

Now let’s imagine our client has changed requirements and we have to add address fields to our form:

```
<form #myForm="ngForm">
  <div>
    <label>Firstname:</label>
    <input type="text" name="firstName" ngModel>
  </div>
  <div>
    <label>Lastname:</label>
    <input type="text" name="lastName" ngModel>
  </div>
  <fieldset ngModelGroup="address">
    <div>
      <label>Zip:</label>
      <input type="text" name="zip" ngModel>
    </div>
    <div>
      <label>Street:</label>
      <input type="text" name="street" ngModel>
    </div>
    <div>
      <label>City:</label>
      <input type="text" name="city" ngModel>
    </div>
  </fieldset>
</form>
<pre>{{ myForm.value | json }}</pre>
```

Stackblitz example

and the value will look as follows:

{
  "firstName": "",
  "lastName": "",
  "address": {
    "zip": "",
    "street": "",
    "city": ""
  }
}

As the app grows inevitably you will face the situation when you need to reuse address fields from the preceding template.

That’s time to refactor our code. For that we can create AddressComponent


import { Component } from '@angular/core';

@Component({
  selector: 'address',
  template: `
    <fieldset ngModelGroup="address">
      <div>
        <label>Zip:</label>
        <input type="text" name="zip" ngModel>
      </div>
      <div>
        <label>Street:</label>
        <input type="text" name="street" ngModel>
      </div>
      <div>
        <label>City:</label>
        <input type="text" name="city" ngModel>
      </div>
    </fieldset>
  `
})
export class AddressComponent  {}

and use it in parent component:

<form #myForm="ngForm">
  <div>
    <label>Firstname:</label>
    <input type="text" name="firstName" ngModel>
  </div>
  <div>
    <label>Lastname:</label>
    <input type="text" name="lastName" ngModel>
  </div>
  <address></address>
</form>
<pre>{{ myForm.value | json }}</pre>

Stackblitz example
The problem

Unfortunately, as soon as we do it, we’ll get the error:

    Template parse errors: No provider for ControlContainer (“[ERROR ->]<fieldset ngModelGroup=”address”>

Hmm… Angular complains about ControlContainer provider for ngModelGroup directive.
Let’s try to find solution

— Where does ControlContainercome from?

If we take a look at source code we can notice that NgForm and NgModelGroup directives provide it within their providers array.

Here is excerpt from ng_form.ts :


export const formDirectiveProvider: any = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgForm)
};

...

@Directive({
  selector: 'form:not([ngNoForm]):not([formGroup]),ngForm,[ngForm]',
  providers: [formDirectiveProvider],
  ...
  exportAs: 'ngForm'
})
export class NgForm extends ControlContainer implements Form {
  ...

This way angular can’t find ControlContainer provider that is declared on form element(NgForm directive lives there).

Now let’s open source code to see where angular requires it.

@Directive({selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup'})
export class NgModelGroup extends AbstractFormGroupDirective implements OnInit, OnDestroy {
  @Input('ngModelGroup') name: string;

  constructor(
      @Host() @SkipSelf() parent: ControlContainer,
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]) {
    super();
    this._parent = parent;
    this._validators = validators;
    this._asyncValidators = asyncValidators;
  }

  /** @internal */
  _checkParentType(): void {
    if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
      TemplateDrivenErrors.modelGroupParentException();
    }
  }
}

As we can see angular blocks search for ControlContainer provider by using Host decorator.

The documentation states that Host decorator:

    Specifies that an injector should retrieve a dependency from any injector until reaching the host element of the current component.

Let’s get back to our AddressComponentand take look at its template:


import { Component } from '@angular/core';

@Component({
  selector: 'address',
  template: `
    <fieldset ngModelGroup="address">
      <div>
        <label>Zip:</label>
        <input type="text" name="zip" ngModel>
      </div>
      <div>
        <label>Street:</label>
        <input type="text" name="street" ngModel>
      </div>
      <div>
        <label>City:</label>
        <input type="text" name="city" ngModel>
      </div>
    </fieldset>
  `
})
export class AddressComponent  {}

In order to find provider angular will walk up from fieldset until it reaches address host element.

But our parent ngForm is located within parent template while NgModelGroup directive requires parent element within current template something like:

<some-element ngForm>

   <some-element ngModelGroup>

The most straightforward solution would be passing parent FormGroup to child component. Such approach is typical for model driven form but we can’t pass FormGroup to ngForm directive.

Let’s get back to the error:

    No provider… No provider… No provider…

Seems angular wants us to declare ControlContainerprovider. So let’s do it!

For those who know how angular DI works it should be easy. Host decorator gives us the opportunity to get a provider from viewProviders declared for host element:


import { Component } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'address',
  template: `
    <fieldset ngModelGroup="address">
      <div>
        <label>Zip:</label>
        <input type="text" name="zip" ngModel>
      </div>
      <div>
        <label>Street:</label>
        <input type="text" name="street" ngModel>
      </div>
      <div>
        <label>City:</label>
        <input type="text" name="city" ngModel>
      </div>
    </fieldset>
  `,
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class AddressComponent  {}

That’s all.

Working example could be found on Stackblitz
