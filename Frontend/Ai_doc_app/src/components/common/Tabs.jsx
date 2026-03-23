import React from 'react'

const Tabs = ({ tabCont, tabItem, actClass, viewer, tabs, activeTab, setActiveTab  }) => {
  return <div>
    <nav className={tabCont}>
        {tabs.map((tab) => (
            <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`${tabItem} ${activeTab === tab.name ? actClass : ''}`}
            >
                {tab.label}
            </button>
        ))}
    </nav>
    <div className={viewer}>
        {tabs.map((tab) => {
            if (tab.name === activeTab) {
                return (
                    <div 
                        key={tab.name}
                    >
                        {tab.content}
                    </div>
                )
            }
        })}
    </div>
  </div>
}

export default Tabs