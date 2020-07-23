import React from 'react';
import s from './Accordion.css';

class Accordion extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.mounted = false;

        let expandedSections = [];
        if (this.props.sections.length > 0) {
            if (this.props.expandedByDefault === true) {
                if (this.props.onlySingleExpanded === true) {
                    expandedSections = [0];
                } else {
                    expandedSections = this.props.sections.map((section, sectionIndex) => {
                        return sectionIndex;
                    });
                }
            }
        }

        this.state = {
            animating: false,
            expandedSections: expandedSections
        };
    }

    componentDidMount() {
        // Mount
        this.mounted = true;

        // Animate initial accordion
        if (this.props.expandedByDefault === true) {
            this.animateAccordionChange();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Iterate sections if they exist
        if (this.mounted === true && this.props.sections.length > 0) {
            // Determine if expanded sections have changed
            let theSame = true;
            if (typeof prevState === 'undefined' && typeof this.state !== 'undefined') {
                theSame = false;
            } else {
                if (prevState.expandedSections.length !== this.state.expandedSections.length) {
                    theSame = false;
                } else {
                    theSame = prevState.expandedSections.every((el, index) => {
                        if (
                            typeof this.state.expandedSections[index] !== 'undefined' &&
                            this.state.expandedSections[index] !== el
                        ) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
            }

            // Only if expanded sections have changed
            if (theSame === false) {
                this.animateAccordionChange();
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    animateAccordionChange() {
        this.props.sections.map((section, sectionIndex) => {
            // Initial data
            const sectionElement = this.refs['section' + sectionIndex];
            const content = sectionElement.querySelector('.' + s.content);
            const container = sectionElement.querySelector('.' + s.container);

            // Get current content height
            // if (content) {
            //     actualHeight = content.offsetHeight + 'px';
            // }

            // Change height of the container
            if (container && content) {
                // Check if container should be expanded or collapsed
                const sectionExpanded = this.state.expandedSections.indexOf(sectionIndex) !== -1 ? true : false;

                // Temporarily disable animation
                container.classList.add(s.disableTransition);

                // Check if container is visible
                if (container.style.display === 'block') {
                    container.style.height = content.offsetHeight + 'px';
                } else {
                    container.style.height = '0px';
                }
                container.style.display = 'block';

                // Get content height
                const contentHeight = content.offsetHeight + 'px';

                // After delay animate in new height
                setTimeout(() => {
                    // Disable no transition class
                    container.classList.remove(s.disableTransition);

                    // For expanded section
                    if (sectionExpanded === true) {
                        // Animate expansion
                        if (container.style.height === '0px') {
                            container.style.height = contentHeight;
                        }
                    } else {
                        // Animate collapse
                        if (container.style.height !== '0px') {
                            container.style.height = '0px';
                        }
                    }

                    // Remove defined dimensions
                    setTimeout(() => {
                        container.classList.add(s.disableTransition);
                        container.style.height = 'auto';
                        container.style.display = sectionExpanded === true ? 'block' : 'none';
                        setTimeout(() => {
                            container.classList.remove(s.disableTransition);
                        });
                    }, 512);
                }, 32);
            }
        });

        // Update state after animation ends
        setTimeout(() => {
            this.setState(
                Object.assign({}, this.state, {
                    animating: false
                })
            );
        }, 500);
    }

    handleSectionExpand(sectionIndex) {
        if (typeof sectionIndex !== 'undefined') {
            if (this.props.onlySingleExpanded === true) {
                // Set only this section as expanded
                this.setState(
                    Object.assign({}, this.state, {
                        animating: true,
                        expandedSections: [sectionIndex]
                    })
                );
            } else {
                // Add this section to expanded sections
                this.setState(
                    Object.assign({}, this.state, {
                        animating: true,
                        expandedSections: this.state.expandedSections
                            .concat([sectionIndex])
                    })
                );
            }
        }
    }

    handleSectionCollapse(sectionIndex) {
        if (typeof sectionIndex !== 'undefined') {
            // Establish section's position in expanded sections array
            const position = this.state.expandedSections.indexOf(sectionIndex);

            // Remove from state
            this.setState(
                Object.assign({}, this.state, {
                    animating: true,
                    expandedSections: this.state.expandedSections
                        .slice(0, position)
                        .concat(this.state.expandedSections.slice(position + 1))
                })
            );
        }
    }

    render() {
        return (
            <div>
                {this.props.sections.map((section, sectionIndex) => {
                    // Is section expanded
                    const sectionExpanded = this.state.expandedSections.indexOf(sectionIndex) !== -1 ? true : false;

                    // Section class name
                    let sectionClassName = s.section;
                    if (sectionExpanded === true) {
                        sectionClassName += ' ' + s.active;
                        sectionClassName += this.state.animating === true ? ' ' + s.animating : '';
                    }

                    // Render
                    return (
                        <div key={section.title} ref={'section' + sectionIndex} className={sectionClassName}>
                            <div className={s.header}>
                                <button
                                    onClick={
                                        sectionExpanded === true
                                            ? e => this.handleSectionCollapse(sectionIndex)
                                            : e => this.handleSectionExpand(sectionIndex)
                                    }
                                >{section.title}</button>
                            </div>
                            <div
                                className={s.container}
                                style={{
                                    height: 'auto',
                                    display: 'none'
                                }}
                            >
                                <div className={s.content}>
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

Accordion.propTypes = {
    sections: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            content: React.PropTypes.element.isRequired
        })
    ),
    expandedByDefault: React.PropTypes.bool,
    onlySingleExpanded: React.PropTypes.bool
};

Accordion.defaultProps = {
    sections: [],
    expandedByDefault: false,
    onlySingleExpanded: true
};

export default Accordion;
