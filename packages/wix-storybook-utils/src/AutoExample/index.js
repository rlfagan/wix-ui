import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import NO_VALUE_TYPE from './no-value-type';
import categorizeProps from './categorize-props';

import { Option, Preview, Code, Toggle, Input, List } from './components';
import { Layout, Cell } from '../ui/Layout';
import SectionCollapse from './components/section-collapse';

import matchFuncProp from './utils/match-func-prop';
import stripQuotes from './utils/strip-quotes';
import omit from './utils/omit';
import ensureRegexp from './utils/ensure-regexp';
import HTMLPropsList from './utils/html-props-list.json';

/**
 * Create a playground for some component, which is suitable for storybook. Given raw `source`, component reference
 * and, optionally, `componentProps`,`AutoExample` will render:
 *
 * * list of all available props with toggles or input fields to control them (with `defaultProps` values applied)
 * * live preview of `component`
 * * live code example
 *
 *
 * ### Example:
 *
 * ```js
 * import AutoExample from 'stories/utils/Components/AutoExample';
 * import component from 'wix-style-react/MyComponent';
 * import source from '!raw-loader!wix-style-react/MyComponent/MyComponent'; // raw string, not something like `export {default} from './MyComponent.js';`
 *
 * <AutoExample
 *   source={source}
 *   component={component}
 *   componentProps={{
 *     value: 'some default value',
 *     onClick: () => console.log('some handler')
 *   }}
 * />
 * ```
 */
export default class extends Component {
  static displayName = 'AutoExample';

  static propTypes = {
    /**
     * parsed meta object about component.
     *
     * Generated by `react-autodocs-utils`
     *
     */
    parsedSource: PropTypes.object,

    /** reference to react component */
    component: PropTypes.func.isRequired,

    /**
     * control default props and their state of component in preview.
     *
     * can be either `object` or `function`:
     *
     * * `object` - simple javascript object which reflects `component` properties.
     * * `function` - `(setProps, getProps) => props`
     *      receives `setProps` setter and `getProps` getter. can be used to persist props state and react to event
     *      handlers and must return an object which will be used as new props. For example:
     *
     * ```js
     * <AutoExample
     *   component={ToggleSwitch}
     *   componentProps={(setProps, getProps) => ({
     *     checked: false,
     *     onChange: () => setProps({ checked: !getProps().checked })
     *   })}
     * ```
     */
    componentProps: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    /** A render function for the component (in the Preview). Typicaly this function can wrap the component in something usefull like a className which is needed. ({component}) => JSXElement */
    componentWrapper: PropTypes.func,
    exampleProps: PropTypes.object,

    /** when true, display only component preview without interactive props nor code example */
    isInteractive: PropTypes.bool,

    /** currently only `false` possible. later same property shall be used for configuring code example */
    codeExample: PropTypes.bool,
  };

  static defaultProps = {
    source: '',
    component: () => null,
    componentProps: {},
    parsedSource: {},
    exampleProps: {},
    isInteractive: true,
    codeExample: true,
  };

  _initialPropsState = {};
  _categorizedProps = [];

  constructor(props) {
    super(props);

    this.parsedComponent = props.parsedSource;
    this.preparedComponentProps = this.prepareComponentProps(
      this.props.componentProps,
    );

    this.state = {
      propsState: {
        ...(this.props.component.defaultProps || {}),
        ...this.preparedComponentProps,
      },
      funcValues: {},
      funcAnimate: {},
      isRtl: false,
      isDarkBackground: false,
    };

    this._initialPropsState = this.state.propsState;

    this._categorizedProps = Object.entries(
      categorizeProps(
        { ...this.preparedComponentProps, ...this.parsedComponent.props },
        this.propsCategories,
      ),
    )
      .map(([, category]) => category)
      .sort(
        ({ order: aOrder = -1 }, { order: bOrder = -1 }) => aOrder - bOrder,
      );
  }

  resetState = () => this.setState({ propsState: this._initialPropsState });

  componentWillReceiveProps(nextProps) {
    this.setState({
      propsState: {
        ...this.state.propsState,
        ...this.prepareComponentProps(nextProps.componentProps),
      },
    });
  }

  prepareComponentProps = props =>
    typeof props === 'function'
      ? props(
          // setState
          componentProps =>
            this.setState({
              propsState: { ...this.state.propsState, ...componentProps },
            }),

          // getState
          () => this.state.propsState || {},
        )
      : props;

  setProp = (key, value) => {
    if (value === NO_VALUE_TYPE) {
      // eslint-disable-next-line no-unused-vars
      const { [key]: deletedKey, ...propsState } = this.state.propsState;
      this.setState({ propsState });
    } else {
      this.setState({ propsState: { ...this.state.propsState, [key]: value } });
    }
  };

  propControllers = [
    {
      types: ['func', /event/, /\) => void$/],

      controller: ({ propKey }) => {
        let classNames = styles.example;

        if (this.state.funcAnimate[propKey]) {
          classNames += ` ${styles.active}`;
          setTimeout(
            () =>
              this.setState({
                funcAnimate: { ...this.state.funcAnimate, [propKey]: false },
              }),
            2000,
          );
        }

        if (this.props.exampleProps[propKey]) {
          return (
            <div className={classNames}>
              {this.state.funcValues[propKey] || 'Interaction preview'}
            </div>
          );
        }
      },
    },

    {
      types: ['bool', 'Boolean'],
      controller: () => <Toggle />,
    },

    {
      types: ['enum'],
      controller: ({ type }) => (
        <List values={type.value.map(({ value }) => stripQuotes(value))} />
      ),
    },

    {
      types: [
        'string',
        'number',
        /ReactText/,
        'arrayOf',
        'union',
        'node',
        'ReactNode',
      ],
      controller: () => <Input />,
    },
  ];

  getPropControlComponent = (propKey, type = {}) => {
    if (!matchFuncProp(type.name) && this.props.exampleProps[propKey]) {
      return <List values={this.props.exampleProps[propKey]} />;
    }

    const propControllerCandidate = this.propControllers.find(({ types }) =>
      types.some(t => ensureRegexp(t).test(type.name)),
    );

    return propControllerCandidate && propControllerCandidate.controller ? (
      propControllerCandidate.controller({ propKey, type })
    ) : (
      <Input />
    );
  };

  renderPropControllers = ({ props, allProps }) => {
    return Object.entries(props).map(([key, prop]) => (
      <Option
        key={key}
        {...{
          label: key,
          value: allProps[key],
          defaultValue:
            typeof this.props.componentProps === 'function'
              ? undefined
              : this.props.componentProps[key],
          isRequired: prop.required || false,
          onChange: value => this.setProp(key, value),
          children: this.getPropControlComponent(key, prop.type),
        }}
      />
    ));
  };

  propsCategories = {
    primary: {
      title: 'Primary Props',
      order: 0,
      isOpen: true,
      matcher: name =>
        // primary props are all those set in componentProps and exampleProps
        // except for callback (starts with `on`) and data attributes (starts
        // with `data`, including data-hook or dataHook)
        Object.keys({
          ...this.props.exampleProps,
          ...this.preparedComponentProps,
        })
          .filter(n => !['on', 'data'].some(i => n.startsWith(i)))
          .some(propName => propName === name),
    },

    events: {
      title: 'Callback Props',
      order: 1,
      matcher: name => name.toLowerCase().startsWith('on'),
    },

    html: {
      title: 'HTML Props',
      order: 3,
      matcher: name => HTMLPropsList.some(i => name === i),
    },

    accessibility: {
      title: 'Accessibility Props',
      order: 4,
      matcher: name => name.toLowerCase().startsWith('aria'),
    },

    other: {
      // miscellaneous props are everything that doesn't fit in other categories
      title: 'Misc. Props',
      order: 5,
      matcher: () => true,
    },
  };

  render() {
    const functionExampleProps = Object.keys(this.props.exampleProps).filter(
      prop =>
        this.parsedComponent.props[prop] &&
        matchFuncProp(this.parsedComponent.props[prop].type.name),
    );

    const componentProps = {
      ...this.state.propsState,
      ...functionExampleProps.reduce((acc, prop) => {
        acc[prop] = (...rest) => {
          if (this.state.propsState[prop]) {
            this.state.propsState[prop](...rest);
          }
          this.setState({
            funcValues: {
              ...this.state.funcValues,
              [prop]: this.props.exampleProps[prop](...rest),
            },
            funcAnimate: { ...this.state.funcAnimate, [prop]: true },
          });
        };
        return acc;
      }, {}),
    };

    const codeProps = {
      ...omit(this.state.propsState)(key => key.startsWith('data')),
      ...functionExampleProps.reduce((acc, key) => {
        acc[key] = this.props.exampleProps[key];
        return acc;
      }, {}),
    };

    const component = React.createElement(this.props.component, componentProps);
    const componentToRender = this.props.componentWrapper
      ? React.cloneElement(this.props.componentWrapper({ component }), {
          'data-hook': 'componentWrapper',
        })
      : component;
      
    if (!this.props.isInteractive) {
      return componentToRender;
    }

    return (
      <Layout dataHook="auto-example">
        <Cell span={6}>
          {this._categorizedProps.reduce(
            (components, { title, isOpen, props }, i) => {
              const renderablePropControllers = this.renderPropControllers({
                props,
                allProps: componentProps, // TODO: ideally this should not be here
              }).filter(({ props: { children } }) => children);

              return renderablePropControllers.length
                ? components.concat(
                    React.createElement(SectionCollapse, {
                      key: title,
                      title,
                      isOpen: isOpen || i === 0,
                      children: renderablePropControllers,
                    }),
                  )
                : components;
            },
            [],
          )}
        </Cell>

        <Preview
          isRtl={this.state.isRtl}
          isDarkBackground={this.state.isDarkBackground}
          onToggleRtl={isRtl => this.setState({ isRtl })}
          onToggleBackground={isDarkBackground =>
            this.setState({ isDarkBackground })
          }
          children={componentToRender}
        />

        {this.props.codeExample && (
          <Code
            dataHook="metadata-codeblock"
            component={React.createElement(this.props.component, codeProps)}
          />
        )}
      </Layout>
    );
  }
}
