/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { OverflowableText } from '../src/components/overflowableText';
import { AnnouncementBanner } from '../src/components/announcement';
import { AnnouncementSeverity } from '../src/utils/types';

// ─── OverflowableText ────────────────────────────────────────────────────────

const overflowableMeta: Meta<typeof OverflowableText> = {
    title: 'Display/OverflowableText',
    component: OverflowableText,
    parameters: {
        docs: {
            description: {
                component:
                    'Displays text that may overflow its container. Shows a tooltip with the full content on hover when the text is clipped.',
            },
        },
    },
    argTypes: {
        text: { control: 'text' },
        maxLineCount: { control: { type: 'number', min: 1, max: 10 } },
    },
};

export default overflowableMeta;
type OverflowableStory = StoryObj<typeof OverflowableText>;

export const SingleLine: OverflowableStory = {
    args: {
        text: 'This text is truncated when it exceeds the width of its container. Hover to see the full content.',
        sx: { maxWidth: 220 },
    },
};

export const MultiLine: OverflowableStory = {
    name: 'Multi-line clamp',
    args: {
        text: 'Long paragraph that gets clamped after a certain number of lines. Keep hovering to read the rest of the content that is hidden behind the ellipsis.',
        maxLineCount: 2,
        sx: { maxWidth: 280 },
    },
};

export const NoOverflow: OverflowableStory = {
    name: 'Short text (no overflow)',
    args: {
        text: 'Short label',
    },
};

// ─── AnnouncementBanner ──────────────────────────────────────────────────────

export const AnnouncementInfo: StoryObj = {
    name: 'AnnouncementBanner – Info',
    render: () => (
        <AnnouncementBanner
            user={{}}
            id={'00000000-0000-0000-0000-000000000001' as any}
            severity={AnnouncementSeverity.INFO}
            title="Scheduled maintenance"
        >
            The system will be unavailable on Sunday 20 April from 02:00 to 04:00 UTC.
        </AnnouncementBanner>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    'An informational announcement banner displayed at the top of the page. The banner can be dismissed by clicking the close button.',
            },
        },
    },
};

export const AnnouncementWarning: StoryObj = {
    name: 'AnnouncementBanner – Warning',
    render: () => (
        <AnnouncementBanner
            user={{}}
            id={'00000000-0000-0000-0000-000000000002' as any}
            severity={AnnouncementSeverity.WARN}
            title="Degraded service"
        >
            Some features may be slow due to high load. Our team is investigating.
        </AnnouncementBanner>
    ),
};
