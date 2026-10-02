/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, jest, beforeEach } from '@jest/globals';
import { RenderBuilder } from '../../../../../tests/testsUtils.test';
import { ElementSaveDialog, ElementSaveDialogProps } from '../ElementSaveDialog';
import { ElementType } from '../../../../../utils';
import * as saveDialogUtils from '../utils';

// `expect` is intentionally used via its ambient global (not imported from '@jest/globals') so
// that the jest-dom matcher augmentations (toBeInTheDocument, toBeEnabled, ...) are picked up.

// The real DirectoryItemSelector triggers network calls (fetchDirectoryContent, etc.).
// It is replaced here by a minimal stand-in so ElementSaveDialog can be tested in isolation.
jest.mock('../../../directoryItemSelector', () => ({
    DirectoryItemSelector: ({ open, onClose }: any) =>
        open ? (
            <button
                type="button"
                data-testid="mock-directory-selector-confirm"
                onClick={() =>
                    onClose([
                        {
                            id: 'folder-1',
                            name: 'MyFolder',
                            description: '',
                            parents: [{ id: 'parent-folder', name: 'ParentFolder' }],
                        },
                    ])
                }
            >
                confirm-selection
            </button>
        ) : null,
}));

// initializeDirectory performs async lookups (localStorage / backend fetch); mocked to control
// the resolved destination folder deterministically.
jest.mock('../utils', () => ({
    ...(jest.requireActual('../utils') as object),
    initializeDirectory: jest.fn(),
}));

// The name field triggers an async "name already exists" check against the backend.
// Mocked to always resolve "available" so tests are not flaky/slow.
jest.mock('../../../../../services', () => ({
    ...(jest.requireActual('../../../../../services') as object),
    elementAlreadyExists: jest.fn<() => Promise<boolean>>().mockResolvedValue(false),
}));

const mockedInitializeDirectory = saveDialogUtils.initializeDirectory as jest.MockedFunction<
    typeof saveDialogUtils.initializeDirectory
>;

// A few translation ids are resolved via intl.formatMessage() (not <FormattedMessage/>), which
// throws/logs a noisy error when the message is missing. They are provided explicitly here to
// keep the test output clean; the actual (unrelated) labels are defined in "parameters" bundle.
const extraTrad = {
    validate: 'Validate',
    showSelectDirectoryDialog: 'showSelectDirectoryDialog',
    showSelectDirectoryItemDialog: 'showSelectDirectoryItemDialog',
    selectorTitle: 'selectorTitle',
};

// Props are loosely typed here on purpose: ElementSaveDialogProps is a discriminated union
// (createOnlyMode / studyUuid vs initDirectory) which is impractical to express through a
// generic "Partial<...>" helper used to override only a few fields per test.
function renderElementSaveDialog(overrides: Record<string, unknown> = {}) {
    const defaultProps = {
        open: true,
        onClose: jest.fn(),
        type: ElementType.STUDY,
        titleId: 'save',
        onSave: jest.fn(),
        createOnlyMode: true,
        studyUuid: 'study-uuid',
    };
    const props = { ...defaultProps, ...overrides } as unknown as ElementSaveDialogProps;
    return new RenderBuilder()
        .withTrad({ ...extraTrad })
        .withTheme()
        .render(<ElementSaveDialog {...props} />);
}

async function typeName(value: string) {
    const user = userEvent.setup();
    const nameInput = await screen.findByTestId('NameInputField');
    await user.clear(nameInput);
    await user.type(nameInput, value);
    return user;
}

describe('ElementSaveDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedInitializeDirectory.mockResolvedValue({
            element: { elementUuid: 'root-folder', elementName: 'RootFolder' } as any,
            path: [],
        });
    });

    describe('create mode (default)', () => {
        it('initializes the destination folder on mount', async () => {
            renderElementSaveDialog();

            await waitFor(() => expect(mockedInitializeDirectory).toHaveBeenCalled());
            expect(await screen.findByText('RootFolder')).toBeInTheDocument();
        });

        it('pre-fills the name field when defaultName is provided', async () => {
            renderElementSaveDialog({ defaultName: 'MyPredefinedName' });

            const nameInput = await screen.findByTestId('NameInputField');
            await waitFor(() => expect(nameInput).toHaveValue('MyPredefinedName'));
        });

        it('generates a prefixed name with a timestamp when only prefixIdForGeneratedName is provided', async () => {
            renderElementSaveDialog({ prefixIdForGeneratedName: 'copyPrefix' });

            const nameInput = await screen.findByTestId('NameInputField');
            await waitFor(() => expect((nameInput as HTMLInputElement).value).toMatch(/^copyPrefix-/));
        });

        it('keeps the save button disabled until the form becomes valid and dirty', async () => {
            renderElementSaveDialog();
            await screen.findByText('RootFolder');

            const saveButton = screen.getByTestId('ValidateButton');
            expect(saveButton).toBeDisabled();

            await typeName('MyElement');

            await waitFor(() => expect(saveButton).toBeEnabled());
        });

        it('opens the directory selector and updates the destination folder on selection', async () => {
            const user = userEvent.setup();
            renderElementSaveDialog();
            await screen.findByText('RootFolder');

            // "showSelectDirectoryDialog" is the raw translation id: this test suite does not
            // load the "parameters" translation bundle where its actual label is defined.
            await user.click(screen.getByText('showSelectDirectoryDialog'));
            await user.click(screen.getByTestId('mock-directory-selector-confirm'));

            expect(await screen.findByText('MyFolder')).toBeInTheDocument();
        });

        it('calls onSave with the expected payload on submit', async () => {
            const onSave = jest.fn();
            const user = userEvent.setup();
            renderElementSaveDialog({ onSave });
            await screen.findByText('RootFolder');

            await typeName('MyElement');

            const saveButton = screen.getByTestId('ValidateButton');
            await waitFor(() => expect(saveButton).toBeEnabled());
            await user.click(saveButton);

            expect(onSave).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'MyElement',
                    folderId: 'root-folder',
                    folderName: 'RootFolder',
                })
            );
        });
    });

    describe('shared creation', () => {
        it('calls onSaveShared instead of onSave when the shared operation is selected', async () => {
            const onSave = jest.fn();
            const onSaveShared = jest.fn();
            const user = userEvent.setup();
            renderElementSaveDialog({
                createOnlyMode: false,
                onSave,
                onSaveShared,
                createSharedLabelId: 'createShared',
                createLabelId: 'createLabel',
                updateLabelId: 'updateLabel',
                selectorTitleId: 'selectorTitle',
                OnUpdate: jest.fn(),
            });
            await screen.findByText('RootFolder');

            await user.click(screen.getByText('createShared'));
            await typeName('SharedElement');

            const saveButton = screen.getByTestId('ValidateButton');
            await waitFor(() => expect(saveButton).toBeEnabled());
            await user.click(saveButton);

            expect(onSaveShared).toHaveBeenCalled();
            expect(onSave).not.toHaveBeenCalled();
        });

        it('does not offer the shared creation option when onSaveShared is not provided', async () => {
            renderElementSaveDialog({
                createOnlyMode: false,
                createLabelId: 'createLabel',
                updateLabelId: 'updateLabel',
                selectorTitleId: 'selectorTitle',
                OnUpdate: jest.fn(),
            });
            await screen.findByText('RootFolder');

            expect(screen.queryByText('createShared')).not.toBeInTheDocument();
        });
    });

    describe('update mode', () => {
        const updateModeProps = {
            createOnlyMode: false as const,
            createLabelId: 'createLabel',
            updateLabelId: 'updateLabel',
            selectorTitleId: 'selectorTitle',
            initialOperation: 'UPDATE' as any,
        };

        it('keeps the save button disabled until an item is selected', async () => {
            const OnUpdate = jest.fn();
            renderElementSaveDialog({ ...updateModeProps, OnUpdate });

            const saveButton = await screen.findByTestId('ValidateButton');
            expect(saveButton).toBeDisabled();
        });

        it('pre-fills name/description from the selected item and calls OnUpdate on submit', async () => {
            const OnUpdate = jest.fn();
            const user = userEvent.setup();
            renderElementSaveDialog({ ...updateModeProps, OnUpdate });

            await user.click(screen.getByText('showSelectDirectoryItemDialog'));
            await user.click(screen.getByTestId('mock-directory-selector-confirm'));

            const nameInput = await screen.findByTestId('NameInputField');
            await waitFor(() => expect(nameInput).toHaveValue('MyFolder'));

            const saveButton = screen.getByTestId('ValidateButton');
            await waitFor(() => expect(saveButton).toBeEnabled());
            await user.click(saveButton);

            expect(OnUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'folder-1',
                    name: 'MyFolder',
                })
            );
        });
    });

    describe('cancellation', () => {
        it('resets the form and calls onClose when cancel is clicked', async () => {
            const onClose = jest.fn();
            const user = userEvent.setup();
            renderElementSaveDialog({ onClose });
            await screen.findByText('RootFolder');

            await typeName('SomeDraftName');
            await user.click(screen.getByTestId('CancelButton'));

            expect(onClose).toHaveBeenCalled();
        });
    });
});
