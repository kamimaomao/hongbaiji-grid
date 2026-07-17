import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#music');
  });

  it('starts a personal music grid and selects the first album', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: '选出伴你最久 的九张专辑' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '开始选择' }));
    expect(screen.getByRole('dialog', { name: '选择一张专辑' })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('搜索名称或别名'), 'In Rainbows');
    await user.click(screen.getByRole('button', { name: '选择 In Rainbows' }));

    expect(screen.getByRole('button', { name: '更换第 1 个专辑：In Rainbows' })).toBeInTheDocument();
    expect(screen.getByText('01 / 09')).toBeInTheDocument();
  });

  it('switches drama prompts without changing the selected category', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '剧集' }));
    expect(screen.getByRole('heading', { name: '这个夏天， 让你上头的 九部剧' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '02 最意难平' }));
    expect(screen.getByRole('heading', { name: '九个故事， 至今仍让你 意难平' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '剧集' })).toHaveAttribute('aria-current', 'page');
  });

  it('advances and can undo an anime duel', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '动漫' }));
    expect(screen.getByRole('heading', { name: '只能留一个，你选谁？' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /点击选择 A/ }));
    expect(screen.getByLabelText('第 2 场，共 15 场')).toBeInTheDocument();

    const undo = screen.getByRole('button', { name: '撤销上一次选择' });
    expect(undo).toBeEnabled();
    await user.click(undo);
    expect(screen.getByLabelText('第 1 场，共 15 场')).toBeInTheDocument();
  });

  it('selects a classic FC game from the renamed category', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'FC经典游戏' }));
    expect(screen.getByRole('heading', { name: '选出你最喜欢的 九款红白机游戏' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '开始选择' }));
    expect(screen.getByRole('dialog', { name: '选择一款红白机游戏' })).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('搜索名称或别名'), '魂斗罗');
    await user.click(screen.getByRole('button', { name: '选择 魂斗罗' }));
    expect(screen.getByRole('button', { name: '更换第 1 个红白机游戏：魂斗罗' })).toBeInTheDocument();
  });

  it.each([
    ['电影', '选出组成你的 九部电影'],
    ['PC游戏', '我的PC游戏 年代史'],
    ['主机游戏', '陪我最久的 九款主机游戏'],
    ['桌游', '最想再开一局的 九款桌游'],
  ])('opens the %s collection', async (category, heading) => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: category }));
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  it('switches from current dramas to the classic drama collection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '剧集' }));
    await user.click(screen.getByRole('button', { name: '经典剧集' }));
    expect(screen.getByRole('heading', { name: 'OST一响， 就回到那一年' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '经典剧集' })).toHaveClass('is-active');
  });
});
