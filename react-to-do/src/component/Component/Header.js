import {
    ActionList,
    AppProvider,
    LegacyCard,
    ContextualSaveBar,
    FormLayout,
    Frame,
    Layout,
    Loading,
    Modal,
    Navigation,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    TextContainer,
    TextField,
    Toast,
    TopBar,
} from '@shopify/polaris';
import {useState, useCallback, useRef} from 'react';
import App from "../App/App";

function Header() {
    const defaultState = useRef({
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    });
    const skipToContentRef = useRef(null);

    const [toastActive, setToastActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
        defaultState.current.nameFieldValue,
    );
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');
    const [activeNavigationItem, setActiveNavigationItem] = useState("Dashboard");

    const handleSubjectChange = useCallback(
        (value: string) => setSupportSubject(value),
        [],
    );
    const handleMessageChange = useCallback(
        (value: string) => setSupportMessage(value),
        [],
    );
    const handleDiscard = useCallback(() => {
        setEmailFieldValue(defaultState.current.emailFieldValue);
        setNameFieldValue(defaultState.current.nameFieldValue);
        setIsDirty(false);
    }, []);
    const handleSave = useCallback(() => {
        defaultState.current.nameFieldValue = nameFieldValue;
        defaultState.current.emailFieldValue = emailFieldValue;

        setIsDirty(false);
        setToastActive(true);
        setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue]);
    const handleNameFieldChange = useCallback((value: string) => {
        setNameFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleEmailFieldChange = useCallback((value: string) => {
        setEmailFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleSearchResultsDismiss = useCallback(() => {
        setSearchActive(false);
        setSearchValue('');
    }, []);
    const handleSearchFieldChange = useCallback((value: string) => {
        setSearchValue(value);
        setSearchActive(value.length > 0);
    }, []);
    const toggleToastActive = useCallback(
        () => setToastActive((toastActive) => !toastActive),
        [],
        [],
    );
    const toggleUserMenuActive = useCallback(
        () => setUserMenuActive((userMenuActive) => !userMenuActive),
        [],
    );
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive,
            ),
        [],
    );
    const toggleIsLoading = useCallback(
        () => setIsLoading((isLoading) => !isLoading),
        [],
    );
    const toggleModalActive = useCallback(
        () => setModalActive((modalActive) => !modalActive),
        [],
    );
    const [currentPage, setCurrentPage] = useState("Account");

    const toastMarkup = toastActive ? (
        <Toast onDismiss={toggleToastActive} content="Changes saved" />
    ) : null;
    const handleNavigationItemClick = (item) => {
        setActiveNavigationItem(item);
        setCurrentPage(item);
        toggleIsLoading();
        setTimeout(() => {
            toggleIsLoading();
        }, 1000);
    };
    const userMenuActions = [
        {
            items: [{content: 'Community forums'}],
        },
    ];

    const contextualSaveBarMarkup = isDirty ? (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: handleSave,
            }}
            discardAction={{
                onAction: handleDiscard,
            }}
        />
    ) : null;

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuActions}
            name="Dharma"
            detail={storeName}
            initials="D"
            open={userMenuActive}
            onToggle={toggleUserMenuActive}
        />
    );

    const searchResultsMarkup = (
        <ActionList
            items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
        />
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={handleSearchFieldChange}
            value={searchValue}
            placeholder="Search"
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            searchResultsVisible={searchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={handleSearchResultsDismiss}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    const navigationMarkup = (
        <Navigation location="/">
            <Navigation.Section
                items={[
                    {
                        label: 'Back to Shopify',
                    },
                ]}
            />
            <Navigation.Section
                separator
                title="Jaded Pixel App"
                items={[
                    {
                        label: "Dashboard",
                        onClick: () => handleNavigationItemClick("Dashboard"),
                    },
                    {
                        label: "Jaded Pixel Orders",
                        onClick: () => handleNavigationItemClick("Jaded Pixel Orders"),
                    },
                    {
                        label: "Todo list",
                        onClick: () => handleNavigationItemClick("Todo list"),
                    },
                ]}
                action={{
                    accessibilityLabel: 'Contact support',
                    onClick: toggleModalActive,
                }}
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
    );
    const pageTodoList = (
        <App />
    )

    let actualPageMarkup;
    switch (currentPage) {
        case "Dashboard":
            actualPageMarkup = (
                <Page title="Dashboard">
                    <Layout>
                        {skipToContentTarget}
                        <Layout.AnnotatedSection
                            title="Account details"
                            description="Jaded Pixel will use this as your account information."
                        >
                            <LegacyCard sectioned>
                                <TextContainer>
                                    <TextField
                                        label="Full name"
                                        value={nameFieldValue}
                                        onChange={handleNameFieldChange}
                                        autoComplete="name"
                                    />
                                    <TextField
                                        type="email"
                                        label="Email"
                                        value={emailFieldValue}
                                        onChange={handleEmailFieldChange}
                                        autoComplete="email"
                                    />
                                </TextContainer>
                            </LegacyCard>
                        </Layout.AnnotatedSection>
                    </Layout>
                </Page>
            );
            break;
        case "Jaded Pixel Orders":
            actualPageMarkup = (
                <Page title="Jaded Pixel Orders">
                    {/* Your JSX for "Jaded Pixel Orders" page */}
                </Page>
            );
            break;
        case "Todo list":
            actualPageMarkup = (
                <Page title="Todo list">
                    <App />
                </Page>
            );
            break;
        default:
            actualPageMarkup = null;
    }
    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={9} />
                        </TextContainer>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;
    // const pageTodoListMarkup = isLoading ? loadingPageMarkup : pageTodoList;

    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="Contact support"
            primaryAction={{
                content: 'Send',
                onAction: toggleModalActive,
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField
                        label="Subject"
                        value={supportSubject}
                        onChange={handleSubjectChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Message"
                        value={supportMessage}
                        onChange={handleMessageChange}
                        autoComplete="off"
                        multiline
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const logo = {
        width: 86,
        topBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        contextualSaveBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        accessibilityLabel: 'Shopify',
    };

    return (
        <div style={{height: '500px'}}>
            <AppProvider
                i18n={{
                    Polaris: {
                        Avatar: {
                            label: 'Avatar',
                            labelWithInitials: 'Avatar with initials {initials}',
                        },
                        ContextualSaveBar: {
                            save: 'Save',
                            discard: 'Discard',
                        },
                        TextField: {
                            characterCount: '{count} characters',
                        },
                        TopBar: {
                            toggleMenuLabel: 'Toggle menu',

                            SearchField: {
                                clearButtonLabel: 'Clear',
                                search: 'Search',
                            },
                        },
                        Modal: {
                            iFrameTitle: 'body markup',
                        },
                        Frame: {
                            skipToContent: 'Skip to content',
                            navigationLabel: 'Navigation',
                            Navigation: {
                                closeMobileNavigationLabel: 'Close navigation',
                            },
                        },
                    },
                }}
            >
                <Frame
                    logo={logo}
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={mobileNavigationActive}
                    onNavigationDismiss={toggleMobileNavigationActive}
                    skipToContentTarget={skipToContentRef}
                >
                    {contextualSaveBarMarkup}
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
        </div>
    );
}

export default Header;