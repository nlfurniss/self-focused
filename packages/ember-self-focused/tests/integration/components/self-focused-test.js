import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import { render} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | self-focused', function(hooks) {
  setupRenderingTest(hooks);

  test('it should not focus the self-focused div for the very first render', async function(assert) {
    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    let selfFocusedDiv = this.element.querySelector('#container > div');
    assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');
    assert.equal(document.body, document.activeElement, 'document.body is the currently focused element');
  });

  test('it should focus the self-focused div for any subsequent render', async function(assert) {
    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    let selfFocusedDiv = this.element.querySelector('#container > div');
    assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');

    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    selfFocusedDiv = this.element.querySelector('#container > div');

    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> is the currently focused element');
  });

  test('it should focus the self-focused div on receiving attributes', async function(assert) {
    this.set('foo', null);

    await render(hbs`
      <button id="dummy">dummy</button>
      <div id="container">
        {{#self-focused foo=foo}}
          template block text
        {{/self-focused}}
      </div>
    `);
    let selfFocusedDiv = this.element.querySelector('#container > div');

    assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');
    assert.equal(document.body, document.activeElement, 'document.body is the currently focused element');

    let button = this.element.querySelector('button');
    button.focus();

    assert.equal(button, document.activeElement, 'dummy <button> is the currently focused element');

    this.set('foo', 'bar');

    selfFocusedDiv = this.element.querySelector('#container > div');
    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> is the currently focused element');
  });

  test('it should remove the tabindex property when self-focused <div> blurs', async function(assert) {
    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    let selfFocusedDiv = this.element.querySelector('#container > div');
    assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');

    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    selfFocusedDiv = this.element.querySelector('#container > div');

    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> is the currently focused element');

    run(() => {
      run.scheduleOnce('afterRender', () => {
        selfFocusedDiv.addEventListener('blur', () => {
          run(() => {
            assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');
            assert.equal(document.body, document.activeElement, 'document.body is the currently focused element');
          })
        })
        selfFocusedDiv.blur();
      })
    });
  });

  test('it should remove the tabindex property when self-focused <div> is clicked', async function(assert) {
    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    let selfFocusedDiv = this.element.querySelector('#container > div');
    assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');

    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    selfFocusedDiv = this.element.querySelector('#container > div');

    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> is the currently focused element');

    run(() => {
      run.scheduleOnce('afterRender', () => {
        selfFocusedDiv.addEventListener('click', () => {
          run(() => {
            assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');
            assert.equal(document.body, document.activeElement, 'document.body is the currently focused element');
          })
        })
        selfFocusedDiv.click();
      })
    });
  });

  test('it should focus the top most self-focused div on insert', async function(assert) {
    await render(hbs`
      <div id="container">
        {{#self-focused}}
          template block text
        {{/self-focused}}
      </div>
    `);

    let selfFocusedDiv = this.element.querySelector('#container > div');
    assert.notOk(selfFocusedDiv.getAttribute('tabindex'), 'self-focused <div> does not have a tabindex property');
    assert.equal(document.body, document.activeElement, 'document.body is the currently focused element');

    await render(hbs`
      <div id="container">
        {{#self-focused class="one"}}
          {{#self-focused class="two"}}
            {{#self-focused class="three"}}
              template block text
            {{/self-focused}}
          {{/self-focused}}
        {{/self-focused}}
      </div>
    `);

    selfFocusedDiv = this.element.querySelector('#container .one');
    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> one has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> one is the currently focused element');
  });

  test('it should focus the child most self-focused div on receiving attribute', async function(assert) {
    this.set('one', null);
    this.set('two', null);
    this.set('three', null);

    await render(hbs`
      <div id="container">
        {{#self-focused class="one" one=one}}
          {{#self-focused class="two" two=two}}
            {{#self-focused class="three" three=three}}
              template block text
            {{/self-focused}}
          {{/self-focused}}
        {{/self-focused}}
      </div>
    `);

    this.set('one', 'foo');

    let selfFocusedDiv = this.element.querySelector('#container .one');
    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> one has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> one is the currently focused element');

    this.set('two', 'foo');

    selfFocusedDiv = this.element.querySelector('#container .two');
    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> two has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> two is the currently focused element');

    this.set('three', 'foo');

    selfFocusedDiv = this.element.querySelector('#container .three');
    assert.equal(selfFocusedDiv.getAttribute('tabindex'), '-1', 'self-focused <div> three has a tabindex property with value -1');
    assert.equal(selfFocusedDiv, document.activeElement, 'self-focused <div> three is the currently focused element');
  });
});
